using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;
using QLNS.Helpers;

namespace QuocGias.Controllers
{
    [Produces("application/json")]
    [Route("api/QuocGias")]
    public class QuocGiasController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public QuocGiasController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/QuocGias/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<QuocGia> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<QuocGia>().FromSql($"tbl_QuocGia_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<QuocGia>();
        }
        
        // GET: api/QuocGias
        [HttpGet]
        public IEnumerable<QuocGia> GetQuocGias()
        {
            return _context.QuocGias;
        }
        
        // GET: api/QuocGias/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuocGia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quocgia = await _context.QuocGias.SingleOrDefaultAsync(m => m.QuocGiaId == id);

            if (quocgia == null)
            {
                return NotFound();
            }

            return Ok(quocgia);
        }
        
        // PUT: api/QuocGias/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuocGia([FromRoute] int id, [FromBody] QuocGia quocgia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != quocgia.QuocGiaId)
            {
                return BadRequest();
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            quocgia.NgaySua = DateTime.Now;
            quocgia.NguoiSua = user;
            _context.Entry(quocgia).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuocGiaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        
        // POST: api/QuocGias
        [HttpPost]
        public async Task<IActionResult> PostQuocGia([FromBody] QuocGia quocgia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            quocgia.NgayTao = DateTime.Now;
            quocgia.NguoiTao = user;
            _context.QuocGias.Add(quocgia);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuocGia", new { id = quocgia.QuocGiaId }, quocgia);
        }
        
        // DELETE: api/QuocGias/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuocGia([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quocgia = await _context.QuocGias.SingleOrDefaultAsync(m => m.QuocGiaId == id);
            if (quocgia == null)
            {
                return NotFound();
            }

            _context.QuocGias.Remove(quocgia);
            await _context.SaveChangesAsync();

            return Ok(quocgia);
        }

        //hungvm
        // GET: api/QuocGias/getMaxViTri
        [HttpGet("getMaxViTri")]
        public IActionResult getMaxViTri()
        {
            return Ok(_context.QuocGias.OrderByDescending(p => p.ViTriHieuThi).FirstOrDefault());
        }

        //hungvm
        // DELETE: api/QuocGias/deleteMore
        [HttpPut("deleteMore")]
        public async Task<IActionResult> DeleteMoreQuocGia([FromBody] int[] listId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var QuocGia = _context.QuocGias.Where(result => listId.Contains(result.QuocGiaId)).ToList();
            if (QuocGia == null)
            {
                return NotFound();
            }

            _context.QuocGias.RemoveRange(QuocGia);
            await _context.SaveChangesAsync();

            return Ok(QuocGia);
        }


        //hungvm
        // Check trùng: api/QuocGias/checkExitsItems
        [HttpPut("checkExitsItemsTen")]
        public async Task<IActionResult> checkExitsItemsTen([FromBody] string value)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var QuocGia = await _context.QuocGias.SingleOrDefaultAsync(m => m.TenQuocGia == value);
            if (QuocGia == null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }

        private bool QuocGiaExists(int id)
        {                        
            return _context.QuocGias.Any(e => e.QuocGiaId == id);
        }
    }    
}