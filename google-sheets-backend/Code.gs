/**
 * ============================================================================
 * Akash & Pranshi Wedding (#APforever) - Guestbook Backend
 * Google Apps Script Web App
 * ============================================================================
 * 
 * Workflow:
 * 1. Guest writes a blessing on website and clicks submit.
 * 2. Blessing is saved in Google Sheet with Approved = FALSE (hidden from website).
 * 3. An instant email is sent to Akash & Pranshi with 1-click sheet link.
 * 4. Open the Sheet and tick the checkbox (✓) in the "Approved" column.
 * 5. Ticked blessings appear on the website. Unticked ones stay hidden.
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet for wedding blessings.
 * 2. In top menu, click: Extensions > Apps Script.
 * 3. Replace all existing code with this file.
 * 4. In toolbar function dropdown, select "testEmailNotification" and click "▷ Run".
 *    -> Click "Review permissions" -> Choose Google account -> "Advanced" -> "Allow".
 *    -> Check your Gmail inbox: you will receive a test blessing notification!
 * 5. Click "Deploy" > "Manage deployments" > Edit (pencil icon) > Version: "New version" > "Deploy".
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------------

// Your notification email address(es). Multiple emails can be separated by comma.
const NOTIFICATION_EMAILS = "akashdubey5450@gmail.com";

// Tab name (falls back to the first sheet if tab is not found)
const SHEET_NAME = "Blessings";

// ----------------------------------------------------------------------------
// GET REQUEST: Returns ONLY Approved (Ticked) Blessings to Website
// ----------------------------------------------------------------------------
function doGet(e) {
  try {
    const sheet = getTargetSheet();
    const lastRow = sheet.getLastRow();

    if (lastRow <= 1) {
      return jsonResponse([]);
    }

    const mapping = getColumnMapping(sheet);
    const data = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    const approvedWishes = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowIndex = i + 2;

      const timestamp = row[mapping.colTimestamp - 1];
      const name = row[mapping.colName - 1];
      const text = row[mapping.colBlessing - 1];
      const approved = (mapping.colApproved <= row.length) ? row[mapping.colApproved - 1] : false;
      const likes = (mapping.colLikes <= row.length) ? (Number(row[mapping.colLikes - 1]) || 0) : 0;
      const id = (mapping.colId && mapping.colId <= row.length && row[mapping.colId - 1])
        ? String(row[mapping.colId - 1])
        : (timestamp instanceof Date ? timestamp.toISOString() : `wish_${rowIndex}`);

      // STRICT CHECKBOX FILTER: Only include if explicitly ticked (TRUE)
      const isApproved = (approved === true || String(approved).trim().toUpperCase() === "TRUE");

      if (isApproved && name && text) {
        approvedWishes.push({
          id: id,
          row: rowIndex,
          name: String(name).trim(),
          text: String(text).trim(),
          likes: likes,
          likedBy: [],
          time: formatRelativeTime(timestamp)
        });
      }
    }

    // Newest approved blessings appear first
    approvedWishes.reverse();

    return jsonResponse(approvedWishes);
  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

// ----------------------------------------------------------------------------
// POST REQUEST: Handles Submissions & Likes
// ----------------------------------------------------------------------------
function doPost(e) {
  try {
    let payload = {};

    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (pErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const sheet = getTargetSheet();
    const mapping = getColumnMapping(sheet, true); // true ensures 'Approved' column exists

    // CASE 1: Like count increment
    if (payload.action === 'like') {
      const rowToUpdate = parseInt(payload.row, 10);
      const newLikes = parseInt(payload.likes, 10) || 0;

      if (rowToUpdate && rowToUpdate >= 2 && rowToUpdate <= sheet.getLastRow()) {
        sheet.getRange(rowToUpdate, mapping.colLikes).setValue(newLikes);
        return jsonResponse({ success: true, row: rowToUpdate, likes: newLikes });
      }

      // Fallback search by ID
      if (payload.id && mapping.colId) {
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          const ids = sheet.getRange(2, mapping.colId, lastRow - 1, 1).getValues();
          for (let i = 0; i < ids.length; i++) {
            if (String(ids[i][0]) === String(payload.id)) {
              const targetRow = i + 2;
              sheet.getRange(targetRow, mapping.colLikes).setValue(newLikes);
              return jsonResponse({ success: true, row: targetRow, likes: newLikes });
            }
          }
        }
      }

      return jsonResponse({ success: false, message: "Row not found for like" });
    }

    // CASE 2: New Blessing Submission
    const name = (payload.name || "").trim();
    const text = (payload.text || "").trim();

    if (!name || !text) {
      return jsonResponse({ success: false, message: "Name and blessing text are required." });
    }

    const now = new Date();
    const uniqueId = `ap_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const totalCols = Math.max(sheet.getLastColumn(), mapping.maxCol);
    const newRowData = new Array(totalCols).fill("");

    newRowData[mapping.colTimestamp - 1] = now;
    newRowData[mapping.colName - 1] = name;
    newRowData[mapping.colBlessing - 1] = text;
    newRowData[mapping.colApproved - 1] = false; // Initially UNAPPROVED (unchecked)
    if (mapping.colLikes) newRowData[mapping.colLikes - 1] = 0;
    if (mapping.colLikedBy) newRowData[mapping.colLikedBy - 1] = "[]";
    if (mapping.colId) newRowData[mapping.colId - 1] = uniqueId;

    // Append the row cleanly
    sheet.appendRow(newRowData);
    const newRowIndex = sheet.getLastRow();

    // Format timestamp nicely
    sheet.getRange(newRowIndex, mapping.colTimestamp).setNumberFormat("yyyy-mm-dd hh:mm:ss");

    // Add interactive Checkbox to the Approved column cell
    const approvedCell = sheet.getRange(newRowIndex, mapping.colApproved);
    const checkboxRule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    approvedCell.setDataValidation(checkboxRule);
    approvedCell.setValue(false);

    // Send instant email notification to Akash & Pranshi
    sendModerationNotification(name, text, newRowIndex);

    return jsonResponse({
      success: true,
      message: "Blessing saved! Waiting for approval.",
      row: newRowIndex,
      id: uniqueId
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ----------------------------------------------------------------------------
// EMAIL NOTIFICATION
// ----------------------------------------------------------------------------
function sendModerationNotification(name, text, rowIndex) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetUrl = ss.getUrl();

    // Build recipient list (configured email + effective user + sheet owner)
    const emails = [];
    if (NOTIFICATION_EMAILS && NOTIFICATION_EMAILS.trim()) {
      NOTIFICATION_EMAILS.split(',').forEach(e => {
        const clean = e.trim();
        if (clean && !emails.includes(clean)) emails.push(clean);
      });
    }

    const effectiveUser = Session.getEffectiveUser().getEmail();
    if (effectiveUser && !emails.includes(effectiveUser)) {
      emails.push(effectiveUser);
    }

    const ownerEmail = ss.getOwner() ? ss.getOwner().getEmail() : "";
    if (ownerEmail && !emails.includes(ownerEmail)) {
      emails.push(ownerEmail);
    }

    const recipient = emails.join(", ");
    if (!recipient) {
      Logger.log("No recipient email found.");
      return;
    }

    const subject = `🌸 New Wedding Blessing from ${name} (#APforever)`;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #fffcf8; border: 1px solid #ebdcc5; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #2e4334 0%, #1c2b20 100%); color: #ffffff; padding: 26px 20px; text-align: center;">
          <div style="font-size: 32px; margin-bottom: 6px;">💍 🌸</div>
          <h2 style="margin: 0; font-size: 21px; font-weight: 600; color: #f5ede2; letter-spacing: 0.5px;">New Blessing Waiting for Review</h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #dfbe7d; letter-spacing: 1.5px; text-transform: uppercase;">Akash &amp; Pranshi &bull; #APforever</p>
        </div>
        
        <!-- Card Body -->
        <div style="padding: 26px 24px;">
          <div style="background: #ffffff; border: 1px solid #ebdcc5; border-radius: 12px; padding: 20px; margin-bottom: 22px;">
            <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #a17833; text-transform: uppercase; letter-spacing: 1px;">Guest Name</p>
            <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #202b23;">${escapeHtml(name)}</p>
            
            <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #a17833; text-transform: uppercase; letter-spacing: 1px;">Heartfelt Message</p>
            <div style="margin: 0; font-size: 15px; color: #3b423d; line-height: 1.6; font-style: italic; background: #fdfbf8; border-left: 3px solid #dfbe7d; padding: 14px 16px; border-radius: 0 8px 8px 0;">
              &ldquo;${escapeHtml(text)}&rdquo;
            </div>
            
            <p style="margin: 16px 0 0 0; font-size: 12px; color: #888;">
              Status: ⏳ <strong>Hidden on website (Pending your approval)</strong> &bull; Row ${rowIndex}
            </p>
          </div>
          
          <!-- Call to Action -->
          <div style="text-align: center; margin: 10px 0 20px 0;">
            <p style="font-size: 14px; color: #555; margin-bottom: 16px; line-height: 1.5;">
              To display this blessing on your website, open your Sheet and <strong>tick the checkbox</strong> in the <strong>Approved</strong> column:
            </p>
            <a href="${sheetUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #c29d59 0%, #a17833 100%); color: #ffffff; text-decoration: none; padding: 13px 32px; border-radius: 30px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 14px rgba(194, 157, 89, 0.4);">
              ✓ Open Sheet &amp; Approve Blessing
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f7f3ec; padding: 12px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ebdcc5;">
          Akash &amp; Pranshi Wedding Website &bull; Blessing Moderation
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: htmlBody
    });
    Logger.log("Notification email successfully sent to: " + recipient);
  } catch (err) {
    Logger.log("Email notification notice: " + err.toString());
  }
}

// ----------------------------------------------------------------------------
// TEST FUNCTION: Authorizes Gmail & tests email delivery in 5 seconds
// ----------------------------------------------------------------------------
function testEmailNotification() {
  sendModerationNotification("Akash (Test)", "Wishing Akash & Pranshi eternal love and happiness! #APforever", 2);
  Logger.log("Test email sent! Please check your Gmail inbox.");
}

// ----------------------------------------------------------------------------
// SETUP HELPER: Formats headers and inserts checkboxes for all rows
// ----------------------------------------------------------------------------
function setupSheet() {
  const sheet = getTargetSheet();
  const mapping = getColumnMapping(sheet, true);

  // Format headers
  const lastCol = sheet.getLastColumn();
  const headerRange = sheet.getRange(1, 1, 1, lastCol);
  headerRange.setBackground("#2e4334");
  headerRange.setFontColor("#f5ede2");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  sheet.setRowHeight(1, 32);
  sheet.setFrozenRows(1);

  // Add checkboxes to the Approved column for all data rows
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const approvedRange = sheet.getRange(2, mapping.colApproved, lastRow - 1, 1);
    const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
    approvedRange.setDataValidation(rule);
  }

  Logger.log("Sheet setup completed successfully! Approved column is at column " + mapping.colApproved);
}

// ----------------------------------------------------------------------------
// COLUMN AUTO-MAPPING
// ----------------------------------------------------------------------------
function getColumnMapping(sheet, autoCreateApproved) {
  const mapping = {
    colTimestamp: 1,
    colName: 2,
    colBlessing: 3,
    colApproved: 0,
    colLikes: 0,
    colLikedBy: 0,
    colId: 0,
    maxCol: 6
  };

  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headerValues = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  for (let c = 0; c < headerValues.length; c++) {
    const val = String(headerValues[c] || "").trim().toLowerCase();
    if (!val) continue;

    if (val.includes("time") || val.includes("date")) mapping.colTimestamp = c + 1;
    else if (val.includes("name") || val.includes("guest") || val.includes("author")) mapping.colName = c + 1;
    else if (val.includes("bless") || val.includes("mess") || val.includes("text") || val.includes("wish")) mapping.colBlessing = c + 1;
    else if (val.includes("approv") || val.includes("tick") || val.includes("show") || val.includes("status")) mapping.colApproved = c + 1;
    else if (val.includes("likedby") || val.includes("liked_by") || val.includes("by")) mapping.colLikedBy = c + 1;
    else if (val.includes("like")) mapping.colLikes = c + 1;
    else if (val === "id") mapping.colId = c + 1;
  }

  // Fallbacks if not named
  if (!mapping.colLikes) mapping.colLikes = 4;
  if (!mapping.colId) mapping.colId = Math.max(lastCol + 1, 6);

  // If Approved column is missing, create it!
  if (!mapping.colApproved) {
    if (autoCreateApproved) {
      mapping.colApproved = lastCol + 1;
      sheet.getRange(1, mapping.colApproved).setValue("Approved");
      sheet.getRange(1, mapping.colApproved).setBackground("#2e4334").setFontColor("#f5ede2").setFontWeight("bold");
      sheet.setColumnWidth(mapping.colApproved, 100);

      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        const checkboxRange = sheet.getRange(2, mapping.colApproved, lastRow - 1, 1);
        const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
        checkboxRange.setDataValidation(rule);
        // By default, leave existing unchecked
        checkboxRange.setValue(false);
      }
    } else {
      mapping.colApproved = lastCol + 1;
    }
  }

  mapping.maxCol = Math.max(mapping.colTimestamp, mapping.colName, mapping.colBlessing, mapping.colApproved, mapping.colLikes, mapping.colId, lastCol);
  return mapping;
}

// ----------------------------------------------------------------------------
// HELPER UTILITIES
// ----------------------------------------------------------------------------
function getTargetSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getActiveSheet() || ss.getSheets()[0];
  }
  return sheet;
}

function formatRelativeTime(dateVal) {
  if (!dateVal) return "Recently";
  const date = (dateVal instanceof Date) ? dateVal : new Date(dateVal);
  if (isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
