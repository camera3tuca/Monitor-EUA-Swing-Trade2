import os
import zipfile

def build_webintoapp_zip():
    dist_dir = os.path.join(os.getcwd(), 'dist')
    public_dir = os.path.join(os.getcwd(), 'public')

    output_zip_public = os.path.join(public_dir, 'app-html-offline.zip')
    output_zip_dist = os.path.join(dist_dir, 'app-html-offline.zip')

    # Remove existing
    for z in [output_zip_public, output_zip_dist]:
        if os.path.exists(z):
            os.remove(z)

    print(f"📦 Criando arquivo ZIP para WebIntoApp (HTML Offline)...")

    # Files and folders to include from dist:
    # index.html MUST be at the root of the zip archive
    # assets/ directory with js & css
    # icons & images
    entries = []
    
    # Check index.html in dist
    index_html = os.path.join(dist_dir, 'index.html')
    if not os.path.exists(index_html):
        raise FileNotFoundError(f"index.html not found in {dist_dir}. Run build first.")
    
    entries.append(('index.html', index_html))

    # Add assets directory
    assets_dir = os.path.join(dist_dir, 'assets')
    if os.path.exists(assets_dir):
        for f in os.listdir(assets_dir):
            full_path = os.path.join(assets_dir, f)
            if os.path.isfile(full_path):
                entries.append((f"assets/{f}", full_path))

    # Add essential public assets
    essential_files = [
        'playstore-icon-512.png',
        'bull-emblem.png',
        'icon-192.png',
        'icon-512.png',
        'icon.svg',
        'manifest.json',
        'sw.js',
        'privacy.html',
        'sciencebit-logo.png',
        'sciencebit-logo-white.png',
        'sciencebit-logo.svg',
        'sciencebit-logo-white.svg'
    ]

    for fname in essential_files:
        p = os.path.join(dist_dir, fname)
        if not os.path.exists(p):
            p = os.path.join(public_dir, fname)
        if os.path.exists(p):
            entries.append((fname, p))

    # Write ZIP with highest compression
    with zipfile.ZipFile(output_zip_public, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for arcname, filepath in entries:
            zf.write(filepath, arcname=arcname)
            print(f"  + {arcname} ({os.path.getsize(filepath)} bytes)")

    # Also copy to webintoapp.zip in public and dist
    import shutil
    shutil.copy2(output_zip_public, output_zip_dist)
    shutil.copy2(output_zip_public, os.path.join(public_dir, 'webintoapp.zip'))
    shutil.copy2(output_zip_public, os.path.join(dist_dir, 'webintoapp.zip'))

    size = os.path.getsize(output_zip_public)
    print(f"✅ Arquivo ZIP gerado com sucesso: {output_zip_public} ({size} bytes)")
    print(f"✅ Arquivo webintoapp.zip atualizado em public/ e dist/ ({size} bytes)")
    return output_zip_public

if __name__ == '__main__':
    build_webintoapp_zip()
