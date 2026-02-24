import glob

slash_quote = chr(92) + '"'
for f in glob.glob('f:/collage_project/**/*', recursive=True):
    if f.endswith(('.tsx', '.ts', '.py')):
        with open(f, 'r', encoding='utf-8') as file:
            c = file.read()
        if slash_quote in c:
            print("Fixing", f)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(c.replace(slash_quote, '"'))
