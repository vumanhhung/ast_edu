using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;

namespace ChucDanhs.Controllers
{
    [Produces("application/json")]
    [Route("api/ChucDanhs")]
    public class ChucDanhsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public ChucDanhsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/ChucDanhs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<ChucDanh> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<ChucDanh>().FromSql($"tbl_ChucDanh_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<ChucDanh>();
        }
        
        // GET: api/ChucDanhs
        [HttpGet]
        public IEnumerable<ChucDanh> GetChucDanhs()
        {
            return _context.ChucDanhs;
        }
        
        // GET: api/ChucDanhs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChucDanh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var chucdanh = await _context.ChucDanhs.SingleOrDefaultAsync(m => m.ChucDanhId == id);

            if (chucdanh == null)
            {
                return NotFound();
            }

            return Ok(chucdanh);
        }
        
        // PUT: api/ChucDanhs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChucDanh([FromRoute] int id, [FromBody] ChucDanh chucdanh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != chucdanh.ChucDanhId)
            {
                return BadRequest();
            }

            _context.Entry(chucdanh).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChucDanhExists(id))
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
        
        // POST: api/ChucDanhs
        [HttpPost]
        public async Task<IActionResult> PostChucDanh([FromBody] ChucDanh chucdanh)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ChucDanhs.Add(chucdanh);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChucDanh", new { id = chucdanh.ChucDanhId }, chucdanh);
        }
        
        // DELETE: api/ChucDanhs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChucDanh([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var chucdanh = await _context.ChucDanhs.SingleOrDefaultAsync(m => m.ChucDanhId == id);
            if (chucdanh == null)
            {
                return NotFound();
            }

            _context.ChucDanhs.Remove(chucdanh);
            await _context.SaveChangesAsync();

            return Ok(chucdanh);
        }

        //hungvm
        // GET: api/QuocGias/getMaxViTri
        [HttpGet("getMaxViTri")]
        public IActionResult getMaxViTri()
        {
            return Ok(_context.ChucDanhs.OrderByDescending(p => p.ViTri).FirstOrDefault());
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

            var QuocGia = await _context.ChucDanhs.SingleOrDefaultAsync(m => m.TenChucDanh == value);
            if (QuocGia == null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }
        private bool ChucDanhExists(int id)
        {                        
            return _context.ChucDanhs.Any(e => e.ChucDanhId == id);
        }
    }    
}