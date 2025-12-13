import jsPDF from 'jspdf';

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: { category: string; items: string[] }[];
  experience: { year: string; title: string; description: string }[];
  projects: { title: string; description: string; tech: string[] }[];
  education: { degree: string; institution: string; year: string }[];
}

const resumeData: ResumeData = {
  name: "Rehan Mulla",
  title: "Creative Developer & Problem Solver",
  email: "rehan@example.com",
  phone: "+91 XXXXX XXXXX",
  location: "India",
  summary: "19-year-old creative developer passionate about building meaningful tech solutions that solve real-world problems. Skilled in web development, Python programming, and UI/UX design with a focus on creating impactful digital experiences.",
  skills: [
    { category: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React"] },
    { category: "Backend", items: ["Python", "Data Structures", "Algorithms"] },
    { category: "Design", items: ["UI/UX Design", "Figma", "Adobe Suite"] },
    { category: "Tools", items: ["Git", "VS Code", "Video Editing", "Graphic Design"] }
  ],
  experience: [
    { year: "2024", title: "Exploring Full-Stack & AI", description: "Learning advanced full-stack development and AI/ML technologies" },
    { year: "2023", title: "Built Real-World Projects", description: "Developed Food Donation System and Women Safety System" },
    { year: "2023", title: "Python & DSA Mastery", description: "Deep dive into Python programming and data structures" },
    { year: "2022", title: "Started Web Development", description: "Began learning HTML, CSS, and building first websites" }
  ],
  projects: [
    { 
      title: "Food Donation System", 
      description: "Platform connecting food donors with NGOs and volunteers to reduce food waste",
      tech: ["Python", "HTML/CSS", "Database", "Maps API"]
    },
    { 
      title: "Women Safety System", 
      description: "Safety platform with SOS alerts, live location tracking, and emergency contacts",
      tech: ["Python", "UI/UX", "GPS API", "Notifications"]
    }
  ],
  education: [
    { degree: "Bachelor of Technology (Pursuing)", institution: "University Name", year: "2024-2028" },
    { degree: "Higher Secondary Education", institution: "School Name", year: "2022-2024" }
  ]
};

export function generateResumePDF(): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Colors
  const primaryColor: [number, number, number] = [0, 255, 255];
  const darkColor: [number, number, number] = [20, 20, 30];
  const textColor: [number, number, number] = [60, 60, 70];

  // Header background
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, pageWidth, 55, 'F');

  // Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(resumeData.name, margin, yPos + 10);

  // Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...primaryColor);
  doc.text(resumeData.title, margin, yPos + 20);

  // Contact info
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  const contactInfo = `${resumeData.email}  |  ${resumeData.phone}  |  ${resumeData.location}`;
  doc.text(contactInfo, margin, yPos + 30);

  yPos = 70;

  // Summary section
  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PROFESSIONAL SUMMARY", margin, yPos);
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos + 2, margin + 50, yPos + 2);

  yPos += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...textColor);
  const summaryLines = doc.splitTextToSize(resumeData.summary, contentWidth);
  doc.text(summaryLines, margin, yPos);
  yPos += summaryLines.length * 5 + 10;

  // Skills section
  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("SKILLS", margin, yPos);
  doc.setDrawColor(...primaryColor);
  doc.line(margin, yPos + 2, margin + 20, yPos + 2);
  yPos += 10;

  doc.setFontSize(10);
  resumeData.skills.forEach((skillGroup) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkColor);
    doc.text(`${skillGroup.category}: `, margin, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    const skillText = skillGroup.items.join(", ");
    doc.text(skillText, margin + 25, yPos);
    yPos += 6;
  });
  yPos += 8;

  // Projects section
  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PROJECTS", margin, yPos);
  doc.setDrawColor(...primaryColor);
  doc.line(margin, yPos + 2, margin + 28, yPos + 2);
  yPos += 10;

  resumeData.projects.forEach((project) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...darkColor);
    doc.text(project.title, margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    const descLines = doc.splitTextToSize(project.description, contentWidth);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 5 + 2;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Tech: ${project.tech.join(", ")}`, margin, yPos);
    yPos += 10;
  });

  // Experience section
  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("JOURNEY", margin, yPos);
  doc.setDrawColor(...primaryColor);
  doc.line(margin, yPos + 2, margin + 25, yPos + 2);
  yPos += 10;

  resumeData.experience.forEach((exp) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text(exp.year, margin, yPos);
    
    doc.setTextColor(...darkColor);
    doc.text(exp.title, margin + 15, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text(exp.description, margin + 15, yPos);
    yPos += 8;
  });

  // Education section
  yPos += 5;
  doc.setTextColor(...darkColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("EDUCATION", margin, yPos);
  doc.setDrawColor(...primaryColor);
  doc.line(margin, yPos + 2, margin + 32, yPos + 2);
  yPos += 10;

  resumeData.education.forEach((edu) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...darkColor);
    doc.text(edu.degree, margin, yPos);
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text(`${edu.institution} | ${edu.year}`, margin, yPos);
    yPos += 8;
  });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Generated from rehanmulla.dev", margin, footerY);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, footerY);

  // Save the PDF
  doc.save("Rehan_Mulla_Resume.pdf");
}

export { resumeData };
