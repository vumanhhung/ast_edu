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

namespace Pupai.Modules.Controllers
{
    [Produces("application/json")]
    [Route("api/QuanHuyens")]
    public class QuanHuyensController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public QuanHuyensController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/QuanHuyens/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<QuanHuyen> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<QuanHuyen>().FromSql($"tbl_QuanHuyen_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<QuanHuyen>();
        }
        
        // GET: api/QuanHuyens
        [HttpGet]
        public IEnumerable<QuanHuyen> GetQuanHuyens()
        {
            return _context.QuanHuyens.Include(r => r.TinhThanhs);
        }
        
        // GET: api/QuanHuyens/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuanHuyen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quanhuyen = await _context.QuanHuyens.Include(r => r.TinhThanhs).SingleOrDefaultAsync(m => m.QuanHuyenId == id);

            if (quanhuyen == null)
            {
                return NotFound();
            }

            return Ok(quanhuyen);
        }
        
        // PUT: api/QuanHuyens/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuanHuyen([FromRoute] int id, [FromBody] QuanHuyen quanhuyen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != quanhuyen.QuanHuyenId)
            {
                return BadRequest();
            }

            _context.Entry(quanhuyen).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuanHuyenExists(id))
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
        
        // POST: api/QuanHuyens
        [HttpPost]
        public async Task<IActionResult> PostQuanHuyen([FromBody] QuanHuyen quanhuyen)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.QuanHuyens.Add(quanhuyen);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuanHuyen", new { id = quanhuyen.QuanHuyenId }, quanhuyen);
        }
        
        // DELETE: api/QuanHuyens/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuanHuyen([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quanhuyen = await _context.QuanHuyens.SingleOrDefaultAsync(m => m.QuanHuyenId == id);
            if (quanhuyen == null)
            {
                return NotFound();
            }

            _context.QuanHuyens.Remove(quanhuyen);
            await _context.SaveChangesAsync();

            return Ok(quanhuyen);
        }

        //hungvm
        // GET: api/QuanHuyens/getMaxViTri
        [HttpGet("getMaxViTri")]
        public IActionResult getMaxViTri()
        {
            return Ok(_context.QuanHuyens.OrderByDescending(p => p.ViTriHienThi).FirstOrDefault());
        }

        //hungvm
        // DELETE: api/QuanHuyens/deleteMore
        [HttpPut("deleteMore")]
        public async Task<IActionResult> DeleteMorequanhuyen([FromBody] int[] listId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quanhuyen = _context.QuanHuyens.Where(result => listId.Contains(result.QuanHuyenId)).ToList();
            if (quanhuyen == null)
            {
                return NotFound();
            }

            _context.QuanHuyens.RemoveRange(quanhuyen);
            await _context.SaveChangesAsync();

            return Ok(quanhuyen);
        }


        //hungvm
        // Check trùng: api/QuanHuyens/checkExitsItems
        [HttpPut("checkExitsItemsTen")]
        public async Task<IActionResult> checkExitsItemsTen([FromBody] string value)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quanhuyen = await _context.QuanHuyens.Include(r => r.TinhThanhs).SingleOrDefaultAsync(m => m.TenQuanHuyen == value);
            if (quanhuyen == null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }

        //hungvm checkExistTinhThanhID
        [HttpGet("checkExistTinhThanh/{id}")]
        public IEnumerable<QuanHuyen> checkExistTinhThanh([FromRoute] int id)
        {
            return _context.QuanHuyens.Where(r => r.TinhThanhId == id);
        }

        //hungvm
        //get data by status
        [HttpGet("getByStatus")]
        public IEnumerable<QuanHuyen> getByStatus()
        {
            return _context.QuanHuyens.Where(r => r.TrangThai == true).ToList();
        }

        private bool QuanHuyenExists(int id)
        {                        
            return _context.QuanHuyens.Any(e => e.QuanHuyenId == id);
        }
    }    
}