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
    [Route("api/RoleDonVis")]
    public class RoleDonVisController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public RoleDonVisController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/RoleDonVis/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<RoleDonVi> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<RoleDonVi>().FromSql($"tbl_RoleDonVi_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<RoleDonVi>();
        }
        
        // GET: api/RoleDonVis
        [HttpGet]
        public IEnumerable<RoleDonVi> GetRoleDonVis()
        {
            return _context.RoleDonVis;
        }
        
        // GET: api/RoleDonVis/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleDonVi([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var roledonvi = await _context.RoleDonVis.SingleOrDefaultAsync(m => m.RoleDonViId == id);

            if (roledonvi == null)
            {
                return NotFound();
            }

            return Ok(roledonvi);
        }
        
        // PUT: api/RoleDonVis/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoleDonVi([FromRoute] int id, [FromBody] RoleDonVi roledonvi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != roledonvi.RoleDonViId)
            {
                return BadRequest();
            }

            _context.Entry(roledonvi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleDonViExists(id))
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
        
        // POST: api/RoleDonVis
        [HttpPost]
        public async Task<IActionResult> PostRoleDonVi([FromBody] RoleDonVi roledonvi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.RoleDonVis.Add(roledonvi);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoleDonVi", new { id = roledonvi.RoleDonViId }, roledonvi);
        }
        
        // DELETE: api/RoleDonVis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoleDonVi([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var roledonvi = await _context.RoleDonVis.SingleOrDefaultAsync(m => m.RoleDonViId == id);
            if (roledonvi == null)
            {
                return NotFound();
            }

            _context.RoleDonVis.Remove(roledonvi);
            await _context.SaveChangesAsync();

            return Ok(roledonvi);
        }
        
         // DELETE: api/RoleDonVis/deleteMore
        [HttpPut("deleteMore")]
        public async Task<IActionResult> DeleteMoreRoleDonVi([FromBody] int[] listId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var roledonvi  =  _context.RoleDonVis.Where(result => listId.Contains(result.RoleDonViId)).ToList();
            if (roledonvi == null )
            {
                return NotFound();
            }

            _context.RoleDonVis.RemoveRange(roledonvi);
            await _context.SaveChangesAsync();

            return Ok(roledonvi);
        }
       
        
        private bool RoleDonViExists(int id)
        {                        
            return _context.RoleDonVis.Any(e => e.RoleDonViId == id);
        }
    }    
}