using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;

namespace ChamCongs.Controllers
{
    [Produces("application/json")]
    [Route("api/ChamCongs")]
    public class ChamCongsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public ChamCongsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/ChamCongs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<ChamCong> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<ChamCong>().FromSql($"tbl_ChamCong_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<ChamCong>();
        }
        
        // GET: api/ChamCongs
        [HttpGet]
        public IEnumerable<ChamCong> GetChamCongs()
        {
            return _context.ChamCongs;
        }
        
        // GET: api/ChamCongs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChamCong([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var chamcong = await _context.ChamCongs.SingleOrDefaultAsync(m => m.ChamCongId == id);

            if (chamcong == null)
            {
                return NotFound();
            }

            return Ok(chamcong);
        }
        
        // PUT: api/ChamCongs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutChamCong([FromRoute] int id, [FromBody] ChamCong chamcong)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != chamcong.ChamCongId)
            {
                return BadRequest();
            }

            _context.Entry(chamcong).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChamCongExists(id))
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
        
        // POST: api/ChamCongs
        [HttpPost]
        public async Task<IActionResult> PostChamCong([FromBody] ChamCong chamcong)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.ChamCongs.Add(chamcong);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetChamCong", new { id = chamcong.ChamCongId }, chamcong);
        }
        
        // DELETE: api/ChamCongs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChamCong([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var chamcong = await _context.ChamCongs.SingleOrDefaultAsync(m => m.ChamCongId == id);
            if (chamcong == null)
            {
                return NotFound();
            }

            _context.ChamCongs.Remove(chamcong);
            await _context.SaveChangesAsync();

            return Ok(chamcong);
        }
        
        private bool ChamCongExists(int id)
        {                        
            return _context.ChamCongs.Any(e => e.ChamCongId == id);
        }
    }    
}