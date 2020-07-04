using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;

namespace BacLuongs.Controllers
{
    [Produces("application/json")]
    [Route("api/BacLuongs")]
    public class BacLuongsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public BacLuongsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/BacLuongs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<BacLuong> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<BacLuong>().FromSql($"tbl_BacLuong_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<BacLuong>();
        }
        
        // GET: api/BacLuongs
        [HttpGet]
        public IEnumerable<BacLuong> GetBacLuongs()
        {
            return _context.BacLuongs;
        }
        
        // GET: api/BacLuongs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBacLuong([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bacluong = await _context.BacLuongs.SingleOrDefaultAsync(m => m.BacLuongId == id);

            if (bacluong == null)
            {
                return NotFound();
            }

            return Ok(bacluong);
        }
        
        // PUT: api/BacLuongs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBacLuong([FromRoute] int id, [FromBody] BacLuong bacluong)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != bacluong.BacLuongId)
            {
                return BadRequest();
            }

            _context.Entry(bacluong).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BacLuongExists(id))
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
        
        // POST: api/BacLuongs
        [HttpPost]
        public async Task<IActionResult> PostBacLuong([FromBody] BacLuong bacluong)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.BacLuongs.Add(bacluong);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBacLuong", new { id = bacluong.BacLuongId }, bacluong);
        }
        
        // DELETE: api/BacLuongs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBacLuong([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bacluong = await _context.BacLuongs.SingleOrDefaultAsync(m => m.BacLuongId == id);
            if (bacluong == null)
            {
                return NotFound();
            }

            _context.BacLuongs.Remove(bacluong);
            await _context.SaveChangesAsync();

            return Ok(bacluong);
        }

        //hungvm
        // DELETE: api/BacLuongs/deleteMore
        [HttpPut("deleteMore")]
        public async Task<IActionResult> DeleteMoreBacLuong([FromBody] int[] listId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var BacLuong = _context.BacLuongs.Where(result => listId.Contains(result.BacLuongId)).ToList();
            if (BacLuong == null)
            {
                return NotFound();
            }

            _context.BacLuongs.RemoveRange(BacLuong);
            await _context.SaveChangesAsync();

            return Ok(BacLuong);
        }


        //hungvm
        // Check trùng: api/BacLuongs/checkExitsItems
        [HttpPut("checkExitsItemsTen")]
        public async Task<IActionResult> checkExitsItemsTen([FromBody] string value)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var BacLuong = await _context.BacLuongs.SingleOrDefaultAsync(m => m.TenBacLuong == value);
            if (BacLuong == null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }

        private bool BacLuongExists(int id)
        {                        
            return _context.BacLuongs.Any(e => e.BacLuongId == id);
        }
    }    
}