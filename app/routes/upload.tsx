import React, { useState , type FormEvent, type JSX } from "react";
import { Link } from "react-router";
import Navbar from "~/component/Navbar";
import FileUploader from "~/component/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2image";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "constants/index";
const Upload: () => JSX.Element = () => {
    const {auth , isLoading , fs , ai , kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }
    const handleAnalyze = async ({CompanyName, JobTitle , JobDescription , file}: {CompanyName: string , JobTitle: string , JobDescription : string , file : File}) => {
      setIsProcessing(true);
setStatusText("Uploading The Resume...");
   const uploadedFile = await fs.upload([file])
   if(!uploadedFile)return setStatusText("Failed to Upload PDF. Please Try Again Later.");
   setStatusText("Converting Resume To Image...");
   const imageFile = await convertPdfToImage(file);
   if(!imageFile.file) return setStatusText("Failed to Convert PDF To Image. Please Try Again Later.");
   setStatusText("Uploading The Image...");
   const UploadedImage = await fs.upload([imageFile.file]);
if(!UploadedImage) return setStatusText("Failed to Upload Image. Please Try Again Later.");
    setStatusText("Analyzing The Resume...");
    const uuid = generateUUID();
    const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: UploadedImage.path,
        CompanyName,
        JobTitle,
        JobDescription,feedback:"",
    }
    await kv.set(`resume:${uuid}`,JSON.stringify(data));
    setStatusText("Getting AI Feedback...");
        const feedback = await ai.feedback( uploadedFile.path, prepareInstructions({JobTitle,JobDescription,}));
        if(!feedback) return setStatusText("Failed to Get AI Feedback. Please Try Again Later.");
        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`,JSON.stringify(data));
        setStatusText("Analysis Complete! Redirecting...");
        console.log(data);
    }
    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if(!form) return;
        const formData = new FormData(form);
        const CompanyName = formData.get("compamy-name") as string;
        const JobTitle = formData.get("job-title") as string;
        const JobDescription = formData.get("job-description") as string;
        if(!file) return;
        handleAnalyze({CompanyName: CompanyName,JobTitle,JobDescription,file});
    }
    return (
<main className="bg-[url('/images/bg-main.svg')] bg-cover">
  <Navbar/>
  <section className = "main-section">
    <div className="page-heading py-16">
        <h1>Smart and Presice Feedback Just For You</h1>
        {isProcessing ? (
            <>
            <h2>{statusText}</h2>
            <img src="/images/resume-scan.gif" className="w-full" />
            </>
        ) : (
            <h2>Drop Your Resume For An ATS Score And An Improvment Tips</h2>
        )}
        {!isProcessing && (
<form id="upload-resume" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
    <div className="form-div">
<label htmlFor="company-name">Company Name</label>
<input type="text" name="compamy-name" placeholder="Company Name" id="company-name" />
    </div>
        <div className="form-div">
<label htmlFor="job-title">Job Title</label>
<input type="text" name="job-title" placeholder="Job Title" id="job-title" />
    </div>
           <div className="form-div">
<label htmlFor="job-description">Job Description</label>
<textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
    </div>
               <div className="form-div">
<label htmlFor="uploader">Upload Resume</label>
<FileUploader onFileSelect={handleFileSelect}/>
    </div>
<button className="primary-button" type="submit">
    Analyze Resume
</button>
</form>
        )}
    </div>
  </section>
    </main>
    )
}
export default Upload;