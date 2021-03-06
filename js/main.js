const url = "./docs/pdf.pdf";

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.5,
  canvas = document.querySelector("#pdf-render"),
  ctx = canvas.getContext("2d");

//Render the page
const renderPage = (num) => {
  pageIsRendering = true;

  //Get the page that you wanna view
  pdfDoc.getPage(num).then((page) => {
    //Set the scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport,
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = true;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    //Output the current page
    document.querySelector("#page-num").textContent = num;
  });
};

//Check for the pages that are rendering
const queueRenderPage = (num) => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

//Show the previous page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(num);
};

//Show the next page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;

  queueRenderPage(pageNum);
};

// Get the document
pdfjsLib
  .getDocument(url)
  .promise.then((pdfDoc_) => {
    document.querySelector("#page-count").textContent = pdfDoc.numPages;

    renderPage(pageNum);
  })
  .catch((err) => {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.appendChild(document.createTextNode(err.message));
    document.querySelector("body").insertBefore(div, canvas);

    //Remove the top bar
    document.querySelector(".top-bar").style.display = "none";
  });

//Button events
const prevPageBtn = document.querySelector("#prev-page");
const nextPageBtn = document.querySelector("#next-page");

//Listen to the events
prevPageBtn.onclick = showPrevPage;

nextPageBtn.onclick = showNextPage;
