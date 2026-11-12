/**
 * Downloads the offline WebIntoApp ZIP file directly in the user's browser.
 * Fetches the ZIP from the applet root and triggers a Blob download,
 * ensuring it works seamlessly inside the AI Studio preview environment.
 */
export async function downloadWebIntoAppZip(filename = 'wallstreet-scanner-webintoapp.zip'): Promise<boolean> {
  try {
    const candidateUrls = [
      './webintoapp.zip',
      '/webintoapp.zip',
      './app-html-offline.zip',
      '/app-html-offline.zip'
    ];

    let blob: Blob | null = null;

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url, { cache: 'no-cache' });
        if (response.ok) {
          blob = await response.blob();
          if (blob && blob.size > 1000) {
            break;
          }
        }
      } catch {
        // try next candidate
      }
    }

    if (blob) {
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(objectUrl);
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 5000);
      return true;
    }

    // Direct fallback if fetch wasn't successful
    const fallbackLink = document.createElement('a');
    fallbackLink.href = './webintoapp.zip';
    fallbackLink.download = filename;
    fallbackLink.style.display = 'none';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    setTimeout(() => {
      if (document.body.contains(fallbackLink)) {
        document.body.removeChild(fallbackLink);
      }
    }, 2000);
    return true;
  } catch (err) {
    console.error('Falha ao baixar arquivo ZIP:', err);
    return false;
  }
}
