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

namespace DoiTacs.Controllers
{
    [Produces("application/json")]
    [Route("api/DoiTacs")]
    public class DoiTacsController : Controller
    {
        private readonly ApplicationDbContext _context;
        
        public DoiTacsController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        // PUT: api/DoiTacs/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<DoiTac> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {            
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<DoiTac>().FromSql($"tbl_DoiTac_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<DoiTac>();
        }
        
        // GET: api/DoiTacs
        [HttpGet]
        public IEnumerable<DoiTac> GetDoiTacs()
        {
            return _context.DoiTacs;
        }
        
        // GET: api/DoiTacs/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoiTac([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var doitac = await _context.DoiTacs.SingleOrDefaultAsync(m => m.DoiTacId == id);

            if (doitac == null)
            {
                return NotFound();
            }

            return Ok(doitac);
        }
        
        // PUT: api/DoiTacs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoiTac([FromRoute] int id, [FromBody] DoiTac doitac)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != doitac.DoiTacId)
            {
                return BadRequest();
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            doitac.NgaySua = DateTime.Now.ToString();
            doitac.NguoiSua = user;
            _context.Entry(doitac).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoiTacExists(id))
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
        
        // POST: api/DoiTacs
        [HttpPost]
        public async Task<IActionResult> PostDoiTac([FromBody] DoiTac doitac)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = this.User.Identity.Name;
            var userId = Utilities.GetUserId(this.User);
            doitac.NgayTao = DateTime.Now.ToString();
            doitac.NguoiTao = user;
            _context.DoiTacs.Add(doitac);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDoiTac", new { id = doitac.DoiTacId }, doitac);
        }
        
        // DELETE: api/DoiTacs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoiTac([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var doitac = await _context.DoiTacs.SingleOrDefaultAsync(m => m.DoiTacId == id);
            if (doitac == null)
            {
                return NotFound();
            }

            _context.DoiTacs.Remove(doitac);
            await _context.SaveChangesAsync();

            return Ok(doitac);
        }

        //hungvm
        // DELETE: api/DoiTacs/deleteMore
        [HttpPut("deleteMore")]
        public async Task<IActionResult> DeleteMoreDoiTac([FromBody] int[] listId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var DoiTac = _context.DoiTacs.Where(result => listId.Contains(result.DoiTacId)).ToList();
            if (DoiTac == null)
            {
                return NotFound();
            }

            _context.DoiTacs.RemoveRange(DoiTac);
            await _context.SaveChangesAsync();

            return Ok(DoiTac);
        }


        //hungvm
        // Check trùng: api/DoiTacs/checkExitsItems
        [HttpPut("checkExitsItemsTen")]
        public async Task<IActionResult> checkExitsItemsTen([FromBody] string value)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var DoiTac = await _context.DoiTacs.SingleOrDefaultAsync(m => m.TenDoiTac == value);
            if (DoiTac == null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }

        private bool DoiTacExists(int id)
        {                        
            return _context.DoiTacs.Any(e => e.DoiTacId == id);
        }
    }    
}