export function exportData(res: any, name: string) {
  if (!res) return;
  const url = window.URL.createObjectURL(new Blob([res]));
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
