import os
import glob

def fix_files():
    for f in glob.glob('f:/collage_project/**/*', recursive=True):
        if f.endswith(('.tsx', '.ts', '.py')) and os.path.isfile(f):
            with open(f, 'r', encoding='utf-8') as file:
                c = file.read()
            if r'"' in c:
                print(f"Fixing {f}")
                with open(f, 'w', encoding='utf-8') as file:
                    file.write(c.replace(r'"', '"'))

if __name__ == "__main__":
    fix_files()
