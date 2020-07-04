using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;

namespace QLNS.Controllers
{
    [Produces("application/json")]
    [Route("api/Logs")]
    public class LogsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public LogsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/Logs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<Log> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<Log>().FromSql($"tbl_Log_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<Log>();
        }
        
        // GET: api/Logs
        [HttpGet]
        public IEnumerable<Log> GetLogs()
        {
            return _context.Logs.OrderByDescending(r => r.NgayThucHien);
        }
        // GET: api/Logs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLog([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var log = await _context.Logs.SingleOrDefaultAsync(m => m.LogID == id);

            if (log == null)
            {
                return NotFound();
            }

            return Ok(log);
        }
        
        // PUT: api/Logs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLog([FromRoute] int id, [FromBody] Log log)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != log.LogID)
            {
                return BadRequest();
            }
            log.NgayThucHien = DateTime.Now;
            _context.Entry(log).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LogExists(id))
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
        
        // POST: api/Logs
        [HttpPost]
        public async Task<IActionResult> PostLog([FromBody] Log log)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            log.NgayThucHien = DateTime.Now;
            _context.Logs.Add(log);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLog", new { id = log.LogID }, log);
        }
        
        // DELETE: api/Logs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLog([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var log = await _context.Logs.SingleOrDefaultAsync(m => m.LogID == id);
            if (log == null)
            {
                return NotFound();
            }

            _context.Logs.Remove(log);
            await _context.SaveChangesAsync();

            return Ok(log);
        }
        
         // DELETE: api/Logs/deleteMore
        //[HttpPut("deleteMore")]
        //public async Task<IActionResult> DeleteMoreLog([FromBody] int[] listId)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var log  =  _context.Logs.Where(result => listId.Contains(result.LogID)).ToList();
        //    if (log == null )
        //    {
        //        return NotFound();
        //    }

        //    _context.Logs.RemoveRange(log);
        //    await _context.SaveChangesAsync();

        //    return Ok(log);
        //}

        // Check trùng: api/Logs/checkExitsItems
        //[HttpPut("checkExitsItems")]
        //public async Task<IActionResult> checkExitsItems([FromBody] string value)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var log = await _context.Logs.SingleOrDefaultAsync(m => m.TenLog == value);
        //    if (log == null)
        //    {
        //        return Ok(false);
        //    }
        //    else
        //    {
        //        return Ok(true);
        //    }   
        //}
        
        private bool LogExists(int id)
        {                        
            return _context.Logs.Any(e => e.LogID == id);
        }
    }    
}