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

namespace GioiTinhs.Controllers
{
    [Produces("application/json")]
    [Route("api/GioiTinhs")]
    public class GioiTinhsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public GioiTinhsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/GioiTinhs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<GioiTinh> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<GioiTinh>().FromSql($"tbl_GioiTinh_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<GioiTinh>();
        }
        
        // GET: api/GioiTinhs
        [HttpGet]
        public IEnumerable<GioiTinh> GetGioiTinhs()
        {
            return _context.GioiTinhs;
        }
        
        // GET: api/GioiTinhs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGioiTinh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var gioitinh = await _context.GioiTinhs.SingleOrDefaultAsync(m => m.GioiTinhId == id);

            if (gioitinh == null)
            {
                return NotFound();
            }

            return Ok(gioitinh);
        }
        
        // PUT: api/GioiTinhs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGioiTinh([FromRoute] int id, [FromBody] GioiTinh gioitinh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != gioitinh.GioiTinhId)
            {
                return BadRequest();
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            gioitinh.NgaySua = DateTime.Now;
            gioitinh.NguoiSua = user;
            _context.Entry(gioitinh).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GioiTinhExists(id))
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
        
        // POST: api/GioiTinhs
        [HttpPost]
        public async Task<IActionResult> PostGioiTinh([FromBody] GioiTinh gioitinh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            gioitinh.NgayTao = DateTime.Now;
            gioitinh.NguoiTao = user;
            _context.GioiTinhs.Add(gioitinh);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGioiTinh", new { id = gioitinh.GioiTinhId }, gioitinh);
        }
        
        // DELETE: api/GioiTinhs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGioiTinh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var gioitinh = await _context.GioiTinhs.SingleOrDefaultAsync(m => m.GioiTinhId == id);
            if (gioitinh == null)
            {
                return NotFound();
            }

            _context.GioiTinhs.Remove(gioitinh);
            await _context.SaveChangesAsync();

            return Ok(gioitinh);
        }

        //hungvm
        // GET: api/GioiTinhs/getMaxViTri
        [HttpGet("getMaxViTri")]
        public IActionResult getMaxViTri()
        {
            return Ok(_context.GioiTinhs.OrderByDescending(p => p.ThuTuHienThi).FirstOrDefault());
        }

        //hungvm
        // DELETE: api/GioiTinhs/deleteMore
        [HttpPut("deleteMore")]
        public async Task<IActionResult> DeleteMoreGioiTinh([FromBody] int[] listId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var GioiTinh = _context.GioiTinhs.Where(result => listId.Contains(result.GioiTinhId)).ToList();
            if (GioiTinh == null)
            {
                return NotFound();
            }

            _context.GioiTinhs.RemoveRange(GioiTinh);
            await _context.SaveChangesAsync();

            return Ok(GioiTinh);
        }

        //hungvm
        // Check trùng: api/GioiTinhs/checkExitsItems
        [HttpPut("checkExitsItemsTen")]
        public async Task<IActionResult> checkExitsItemsTen([FromBody] string value)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var GioiTinh = await _context.GioiTinhs.SingleOrDefaultAsync(m => m.TenGioiTinh == value);
            if (GioiTinh == null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }

        private bool GioiTinhExists(int id)
        {                        
            return _context.GioiTinhs.Any(e => e.GioiTinhId == id);
        }
    }    
}