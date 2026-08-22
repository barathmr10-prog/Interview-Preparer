export const downloadAsText = (question: string, answer: string, filenamePrefix: string = 'Interview_QA') => {
  const content = `--- Interview Question ---\n${question}\n\n--- Suggested Answer ---\n${answer}\n`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filenamePrefix}_${new Date().toISOString().slice(0,10)}.txt`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
