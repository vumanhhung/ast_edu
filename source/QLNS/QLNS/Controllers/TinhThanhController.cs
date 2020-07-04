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
    [Route("api/TinhThanhs")]
    public class TinhThanhsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public TinhThanhsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/TinhThanhs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<TinhThanh> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<TinhThanh>().FromSql($"tbl_TinhThanh_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<TinhThanh>();
        }
        
        // GET: api/TinhThanhs
        [HttpGet]
        public IEnumerable<TinhThanh> GetTinhThanhs()
        {
            return _context.TinhThanhs;
        }
        
        // GET: api/TinhThanhs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTinhThanh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tinhthanh = await _context.TinhThanhs.SingleOrDefaultAsync(m => m.TinhThanhId == id);

            if (tinhthanh == null)
            {
                return NotFound();
            }

            return Ok(tinhthanh);
        }
        
        // PUT: api/TinhThanhs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTinhThanh([FromRoute] int id, [FromBody] TinhThanh tinhthanh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tinhthanh.TinhThanhId)
            {
                return BadRequest();
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            tinhthanh.NgaySua = DateTime.Now;
            tinhthanh.NguoiSua = user;
            _context.Entry(tinhthanh).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TinhThanhExists(id))
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
        
        // POST: api/TinhThanhs
        [HttpPost]
        public async Task<IActionResult> PostTinhThanh([FromBody] TinhThanh tinhthanh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            tinhthanh.NgayNhap = DateTime.Now;
            tinhthanh.NguoiNhap = user;
            _context.TinhThanhs.Add(tinhthanh);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTinhThanh", new { id = tinhthanh.TinhThanhId }, tinhthanh);
        }
        
        // DELETE: api/TinhThanhs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTinhThanh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tinhthanh = await _context.TinhThanhs.SingleOrDefaultAsync(m => m.TinhThanhId == id);
            if (tinhthanh == null)
            {
                return NotFound();
            }

            _context.TinhThanhs.Remove(tinhthanh);
            await _context.SaveChangesAsync();

            return Ok(tinhthanh);
        }

        //hungvm
        // GET: api/TinhThanhs/getMaxViTri
        [HttpGet("getMaxViTri")]
        public IActionResult getMaxViTri()
        {
            return Ok(_context.TinhThanhs.OrderByDescending(p => p.ViTri).FirstOrDefault());
        }

        //hungvm
        // DELETE: api/TinhThanhs/deleteMore
        [HttpPut("deleteMore")]
        public async Task<IActionResult> DeleteMoreTinhThanh([FromBody] int[] listId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tinhthanh = _context.TinhThanhs.Where(result => listId.Contains(result.TinhThanhId)).ToList();
            if (tinhthanh == null)
            {
                return NotFound();
            }

            _context.TinhThanhs.RemoveRange(tinhthanh);
            await _context.SaveChangesAsync();

            return Ok(tinhthanh);
        }


        //hungvm
        // Check trùng: api/TinhThanhs/checkExitsItems
        [HttpPut("checkExitsItemsTen")]
        public async Task<IActionResult> checkExitsItemsTen([FromBody] string value)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var tinhthanh = await _context.TinhThanhs.SingleOrDefaultAsync(m => m.TenTinhThanh == value);
            if (tinhthanh == null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }



        //hungvm
        //get data by status
        [HttpGet("getAllByStatus")]
        public IEnumerable<TinhThanh> getByStatus()
        {
            return _context.TinhThanhs.Where(r => r.TrangThai == true).ToList();
        }

        private bool TinhThanhExists(int id)
        {                        
            return _context.TinhThanhs.Any(e => e.TinhThanhId == id);
        }
    }    
}