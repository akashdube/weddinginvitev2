with open('envelope-demo.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if '<!-- ==' in line or '<h2' in line or '<h3' in line:
            print(f'{i+1}: {line.strip()[:100]}')
