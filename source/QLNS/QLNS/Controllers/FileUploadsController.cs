﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;
using System.IO;
using Microsoft.Extensions.FileProviders;
using System.Net.Http;
using System.Text;
using System.Xml;
using System.Collections;


namespace DemoWebapp.Controllers
{
    [Route("api/FileUploads")]
    public class FileUploadsController : Controller
    {
        private readonly ApplicationDbContext _context;
        public FileUploadsController(ApplicationDbContext context)
        {
            _context = context;
        }
        private static Random random = new Random();
        [HttpPost("UploadFile")]
        public async Task<IActionResult> UploadFile([FromForm]ICollection<IFormFile> files, string stringRandom, string urlSever)
        {
            var a = stringRandom;
            var b = urlSever;
            long size = files.Sum(f => f.Length);
            // full path to file in temp location
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot" + b);
            var fileName = "";
            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    try
                    {
                        using (var stream = new FileStream(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot" + b, a + "_" + formFile.FileName), FileMode.Create))
                        {
                            await formFile.CopyToAsync(stream);
                        }
                    }
                    catch(Exception)
                    {
                        if(!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                            using (var stream = new FileStream(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot" + b, a + "_" + formFile.FileName), FileMode.Create))
                            {
                                await formFile.CopyToAsync(stream);
                            }
                        }
                    }
                }
            }
            return Ok(new { count = files.Count, size, filePath,fileName });
        }

        [HttpPost("Remove")]
        public IActionResult Remove([FromBody] string[] fileNames)
        {
            if (fileNames != null)
            {
                foreach (var fullName in fileNames)
                {
                    var fileName = Path.GetFileName(fullName);
                    var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/", fileName);
                    if (System.IO.File.Exists(physicalPath))
                    {
                        System.IO.File.Delete(physicalPath);
                    }
                }
            }
            return Ok("Success");
        }


        [HttpPost("RemoveFileByPath")]
        public IActionResult RemoveFileByPath([FromBody] string [] fileNames)
        {
            if (fileNames != null && fileNames.Length > 0)
            {
                for (int i = 0; i < fileNames.Length; i++)
                {
                    var fileName = fileNames[i];
                    if (fileName.Length > 0)
                    {
                        var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot" + fileName);
                        if (System.IO.File.Exists(physicalPath))
                        {
                            System.IO.File.Delete(physicalPath);
                        }
                    }
                }
            }
            return Ok(Json("Success"));
        }


        [HttpPost("RemoveFileBySinglePath")]
        public IActionResult RemoveFileBySinglePath([FromBody] string fileNames)
        {
            if (fileNames != null && fileNames.Length > 0)
            {
                    var fileName = fileNames;
                    if (fileName.Length > 0)
                    {
                        var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot" + fileName);
                        if (System.IO.File.Exists(physicalPath))
                        {
                            System.IO.File.Delete(physicalPath);
                        }
                    }
            }
            return Ok(Json("Success"));
        }

        //[HttpPut("LoadListFile/{idItem}")]
        //public IEnumerable LoadListFile([FromBody] string forder, [FromRoute] int idItem)
        //{
        //    if (idItem > 0)
        //    {
        //        var dv = _context.DonVis.Where(row => row.DonViId == idItem).First();
        //        bool isRecursive = true;
        //        List<String> filesFound = new List<String>();
        //        List<String> filesName = new List<String>();
        //        ArrayList arrayList = new ArrayList();
        //        arrayList = LayArrayChuoi(dv.SubLv, "");
        //        var searchOption = isRecursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;
        //        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot" + forder);

        //        filesFound.AddRange(Directory.GetFiles(filePath, String.Format("*.{0}", "*"), searchOption).Select(f => Path.GetFileName(f)).Where(f => arrayList.Contains(Path.GetFileName(f))));


        //        yield return Ok(Json(filesFound));
        //    }
        //    else
        //    {
        //        yield return Ok("Không có file");
        //    }
        //}

        public static ArrayList LayArrayChuoi(string chuoiNguon, string chuoiPhanCach)
        {
            if (chuoiPhanCach.Length < 1)
            {
                chuoiPhanCach = "*!<=*ParamsSpilitItems*=>*!";
            }
            ArrayList arrayList = new ArrayList();
            string[] strArray = chuoiNguon.Split(new string[] { chuoiPhanCach }, StringSplitOptions.None);
            if (strArray.Length > 0)
            {
                for(int i=0;i< strArray.Length;i++)
                {
                    if (strArray[i].ToString().Length > 0)
                    {
                        arrayList.Add(Path.GetFileName(strArray[i].ToString()));
                    }
                }
            }
            return arrayList;
        }

        //[HttpPost("SaveFile")]
        //public IActionResult SaveFile([FromBody] string[] a)
        //{
        //    try
        //    {
        //        string watermarkText = "NamCustoms";
        //        string dt = DateTime.Now.Ticks.ToString();
        //        string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/Bill-" + RandomString(5) + "-" + dt + ".pdf");
        //        FileStream fs = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None);
        //        Document doc = new Document(PageSize.A4, 20, 20, 20, 40);
        //        #pragma warning disable CS0612 // Type or member is obsolete
        //        StyleSheet styles = new StyleSheet();
        //        #pragma warning restore CS0612 // Type or member is obsolete
        //        //Load style width Class
        //        styles.LoadStyle("What_is_a_table", "color", "red");
        //        styles.LoadStyle("highlight-span", "color", "blue");
        //        //Load style width Tag. Ex <h1><h2>
        //        //styles.LoadTagStyle("h3", "color", "red");
        //        //styles.LoadTagStyle("h2", "color", "blue");

        //        using (PdfWriter writer = PdfWriter.GetInstance(doc, fs))
        //        {
        //            writer.PageEvent = new PDFWriterEvents(watermarkText);
        //            doc.Open();
        //            String htmlText = "";
        //            for (int i = 0; i < a.Length; i++)
        //            {
        //                if (a[i].Substring(0,7) == "imgurl:")
        //                {
        //                    string url = a[i].Replace("imgurl:", "");
        //                    Image jpg = Image.GetInstance(new Uri(url));
        //                    jpg.ScaleToFit(400f, 400f);
        //                    jpg.Alignment = Image.ALIGN_CENTER;
        //                    doc.Add(jpg);
        //                }
        //                else if (a[i].Substring(0,7) == "imgloc:")
        //                {
        //                    string imagepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
        //                    Image gif = Image.GetInstance(imagepath + a[i].Replace("imgloc:", "/"));
        //                    gif.ScaleToFit(400f, 400f);
        //                    gif.Alignment = Image.ALIGN_CENTER;
        //                    doc.Add(gif);
        //                }
        //                else
        //                {

        //                    htmlText = a[i].ToString();
        //                    #pragma warning disable CS0612 // Type or member is obsolete
        //                    List<IElement> htmlarraylist = iTextSharp.text.html.simpleparser.HTMLWorker.ParseToList(new StringReader(htmlText),styles);
        //                    #pragma warning restore CS0612 // Type or member is obsolete
        //                    Paragraph mypara = new Paragraph();
        //                    mypara.IndentationLeft = 36;
        //                    mypara.InsertRange(0, htmlarraylist);
        //                    doc.Add(mypara);
        //                }
        //            }
        //            doc.Close();
        //        }
        //    }
        //    catch (DocumentException de)
        //    {
        //        throw de;
        //    }
        //    catch (IOException ioe)
        //    {
        //        throw ioe;
        //    }
        //    return Ok("Success");
        //}

        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private byte[] GetByteArrayFromImage(IFormFile file)
        {
            using (var target = new MemoryStream())
            {
                file.CopyTo(target);
                return target.ToArray();
            }
        }
    }


    //class PDFWriterEvents : IPdfPageEvent
    //{
    //    string watermarkText;
    //    float fontSize = 40f;
    //    float xPosition = 300f;
    //    float yPosition = 800f;
    //    float angle = 45f;

    //    public PDFWriterEvents(string watermarkText, float fontSize = 80f, float xPosition = 300f, float yPosition = 400f, float angle = 45f)
    //    {
    //        this.watermarkText = watermarkText;
    //        this.xPosition = xPosition;
    //        this.yPosition = yPosition;
    //        this.angle = angle;
    //    }

    //    public void OnOpenDocument(PdfWriter writer, Document document) { }
    //    public void OnCloseDocument(PdfWriter writer, Document document) { }
    //    public void OnStartPage(PdfWriter writer, Document document)
    //    {
    //        try
    //        {
    //            PdfContentByte cb = writer.DirectContentUnder;
    //            BaseFont baseFont = BaseFont.CreateFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.EMBEDDED);
    //            cb.BeginText();
    //            cb.SetColorFill(BaseColor.LIGHT_GRAY);
    //            cb.SetFontAndSize(baseFont, fontSize);
    //            cb.ShowTextAligned(PdfContentByte.ALIGN_CENTER, watermarkText, xPosition, yPosition, angle);
    //            cb.EndText();
    //        }
    //        catch (DocumentException docEx)
    //        {
    //            throw docEx;
    //        }
    //    }
    //    public void OnEndPage(PdfWriter writer, Document document) { }
    //    public void OnParagraph(PdfWriter writer, Document document, float paragraphPosition) { }
    //    public void OnParagraphEnd(PdfWriter writer, Document document, float paragraphPosition) { }
    //    public void OnChapter(PdfWriter writer, Document document, float paragraphPosition, Paragraph title) { }
    //    public void OnChapterEnd(PdfWriter writer, Document document, float paragraphPosition) { }
    //    public void OnSection(PdfWriter writer, Document document, float paragraphPosition, int depth, Paragraph title) { }
    //    public void OnSectionEnd(PdfWriter writer, Document document, float paragraphPosition) { }
    //    public void OnGenericTag(PdfWriter writer, Document document, Rectangle rect, String text) { }

    //}
}