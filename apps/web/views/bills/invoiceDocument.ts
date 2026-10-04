const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const PRINT_CLEANUP_FALLBACK_MS = 60 * 1000;

const createInvoiceFrame = async (html: string) => {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  Object.assign(frame.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: `${A4_WIDTH_MM}mm`,
    height: `${A4_HEIGHT_MM}mm`,
    border: '0',
  });
  document.body.appendChild(frame);

  const frameDocument = frame.contentDocument as Document;
  frameDocument.open();
  frameDocument.write(html);
  frameDocument.close();

  await frameDocument.fonts?.ready;
  return { frame, frameDocument };
};

const getInvoiceElement = (frameDocument: Document) =>
  frameDocument.querySelector('.invoice') as HTMLElement;

const fitToSinglePage = (frame: HTMLIFrameElement, frameDocument: Document) => {
  const invoice = getInvoiceElement(frameDocument);
  const pageHeight = frame.getBoundingClientRect().height;
  const contentHeight = invoice.scrollHeight;

  if (contentHeight > pageHeight) {
    invoice.style.zoom = String(pageHeight / contentHeight);
  }
};

export const printInvoice = async (html: string) => {
  const { frame, frameDocument } = await createInvoiceFrame(html);
  const frameWindow = frame.contentWindow as Window;

  fitToSinglePage(frame, frameDocument);

  let isRemoved = false;
  const removeFrame = () => {
    if (!isRemoved) {
      isRemoved = true;
      frame.remove();
    }
  };

  frameWindow.addEventListener('afterprint', removeFrame);
  setTimeout(removeFrame, PRINT_CLEANUP_FALLBACK_MS);

  frameWindow.focus();
  frameWindow.print();
};

export const downloadInvoicePdf = async (html: string, fileName: string) => {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const { frame, frameDocument } = await createInvoiceFrame(html);

  try {
    const canvas = await html2canvas(getInvoiceElement(frameDocument), {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    });

    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    });
    const imageHeight = (canvas.height * A4_WIDTH_MM) / canvas.width;

    const scale = Math.min(1, A4_HEIGHT_MM / imageHeight);
    const width = A4_WIDTH_MM * scale;
    const height = imageHeight * scale;

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      (A4_WIDTH_MM - width) / 2,
      0,
      width,
      height
    );
    pdf.save(fileName);
  } finally {
    frame.remove();
  }
};
