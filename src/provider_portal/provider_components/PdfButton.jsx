import React, { useRef } from "react";
import { Button, Box } from "@mui/material";
import ReactToPrint from "react-to-print";
import PdfPerforma from "./PdfPerforma";

function PdfButton({ children }) {
  const performaRef = useRef();

  return (
    <>
      <ReactToPrint
        trigger={() => children}
        content={() => performaRef.current}
      />
      <Box sx={{ display: "none" }}>
        <PdfPerforma ref={performaRef} />
      </Box>
    </>
  );
}

export default PdfButton;

// =================================tried with another library=======================================
// import React, { useRef } from "react";
// import { Button, Box } from "@mui/material";
// import PdfPerforma from "./PdfPerforma";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// function PdfButton() {
//   const performaRef = useRef();

//   const handleGeneratePDF = () => {
//     const input = performaRef.current;
//     if (!input) return;

//     // Ensure the content is fully rendered
//     setTimeout(() => {
//       html2canvas(input, {
//         useCORS: true, // Handle cross-origin images
//         allowTaint: true, // Allow tainted images
//       })
//         .then((canvas) => {
//           const imgData = canvas.toDataURL("image/png");
//           const pdf = new jsPDF("p", "mm", "a4");
//           const imgWidth = 210; // A4 width in mm
//           const imgHeight = (canvas.height * imgWidth) / canvas.width;
//           pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//           pdf.output("dataurlnewwindow"); // Open PDF in new tab
//         })
//         .catch((error) => {
//           console.error("Error capturing content:", error);
//         });
//     }, 100); // Short delay to ensure content is fully rendered
//   };

//   return (
//     <Box sx={{ padding: "20px" }}>
//       <h1>Generate PDF Example</h1>
//       <Button variant="contained" onClick={handleGeneratePDF}>
//         Generate PDF
//       </Button>
//       <Box
//         ref={performaRef}
//         sx={{ padding: "20px", backgroundColor: "white", marginTop: "20px" }}
//       >
//         <PdfPerforma />
//       </Box>
//     </Box>
//   );
// }

// export default PdfButton;
