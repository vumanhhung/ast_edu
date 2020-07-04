using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DAL;
using DAL.Models;
using Newtonsoft.Json.Linq;
using QLNS.ViewModels;

namespace QLNS.Controllers
{
    [Produces("application/json")]
    [Route("api/DonVis")]
    public class DonVisController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DonVisController(ApplicationDbContext context)
        {
            _context = context;
        }

        // PUT: api/DonVis/getDonViByRole
        [HttpGet("getDonViByRole/{userId}")]
        public JArray GetDonViByRole([FromRoute] string userId)
        {
            var query = _context.Set<DonVi>().FromSql($"GetDonViByRole {userId},{0}").ToList<DonVi>();
            JObject jObject = new JObject();
            JArray jArray = new JArray();
            for (var i = 0; i < query.Count(); i++)
            {
                jObject = new JObject();
                jObject.Add("donViId", query[i].DonViId);
                jObject.Add("tenDonVi", query[i].TenDonVi);
                jObject.Add("maDonViCha", query[i].MaDonViCha);
                jObject.Add("kyHieu", query[i].KyHieu);
                jObject.Add("subLv", query[i].SubLv);
                jObject.Add("ngonNgu", query[i].NgonNgu);
                jObject.Add("viTri", query[i].ViTri);
                jObject.Add("dienGiai", query[i].DienGiai);
                jObject.Add("trangThai", query[i].TrangThai);
                jObject.Add("nguoiNhap", query[i].NguoiNhap);
                jObject.Add("ngayNhap", query[i].NgayNhap);
                jObject.Add("nguoiSua", query[i].NguoiSua);
                jObject.Add("ngaySua", query[i].NgaySua);
                GetChildByRole(query[i].DonViId, jObject, jArray, userId);
                jArray.Add(jObject);

            }
            return jArray;
        }

        private JObject GetChildByRole(int parentNode, JObject jObject, JArray jArray, string userId)
        {
            var query1 = _context.Set<DonVi>().FromSql($"GetDonViByRole {userId},{parentNode}").ToList<DonVi>();
            if (query1.Count() > 0)
            {
                JObject jObject1 = new JObject();
                JArray jArray1 = new JArray();
                for (var i = 0; i < query1.Count(); i++)
                {
                    jObject1 = new JObject();
                    jObject1.Add("donViId", query1[i].DonViId);
                    jObject1.Add("tenDonVi", query1[i].TenDonVi);
                    jObject1.Add("maDonViCha", query1[i].MaDonViCha);
                    jObject1.Add("kyHieu", query1[i].KyHieu);
                    jObject1.Add("subLv", query1[i].SubLv);
                    jObject1.Add("ngonNgu", query1[i].NgonNgu);
                    jObject1.Add("viTri", query1[i].ViTri);
                    jObject1.Add("dienGiai", query1[i].DienGiai);
                    jObject1.Add("trangThai", query1[i].TrangThai);
                    jObject1.Add("nguoiNhap", query1[i].NguoiNhap);
                    jObject1.Add("ngayNhap", query1[i].NgayNhap);
                    jObject1.Add("nguoiSua", query1[i].NguoiSua);
                    jObject1.Add("ngaySua", query1[i].NgaySua);
                    GetChildByRole(query1[i].DonViId, jObject1, jArray1, userId);
                    jArray1.Add(jObject1);
                }
                jObject.Add("items", jArray1);
            }
            return jObject;

        }

        // PUT: api/DonVis/getItems/5/5/x
        [HttpPut("getItems/{start}/{count}/{orderby}")]
        public IEnumerable<DonVi> GetItems([FromRoute] int start, int count, string orderBy, [FromBody] string whereClause)
        {
            orderBy = orderBy != "x" ? orderBy : "";
            return _context.Set<DonVi>().FromSql($"tbl_DonVi_GetItemsByRange {start},{count},{whereClause},{orderBy}").ToList<DonVi>();
        }

        // GET: api/DonVis
        [HttpGet]
        public JArray GetTMNs()
        {
            var query = _context.DonVis.Where(m => m.MaDonViCha == 0).OrderBy(o => o.ViTri).ToList();
            JObject jObject = new JObject();
            JArray jArray = new JArray();
            for (var i = 0; i < query.Count(); i++)
            {
                jObject = new JObject();
                jObject.Add("donViId", query[i].DonViId);
                jObject.Add("tenDonVi", query[i].TenDonVi);
                jObject.Add("maDonViCha", query[i].MaDonViCha);
                jObject.Add("kyHieu", query[i].KyHieu);
                jObject.Add("subLv", query[i].SubLv);
                jObject.Add("ngonNgu", query[i].NgonNgu);
                jObject.Add("viTri", query[i].ViTri);
                jObject.Add("dienGiai", query[i].DienGiai);
                jObject.Add("trangThai", query[i].TrangThai);
                jObject.Add("nguoiNhap", query[i].NguoiNhap);
                jObject.Add("ngayNhap", query[i].NgayNhap);
                jObject.Add("nguoiSua", query[i].NguoiSua);
                jObject.Add("ngaySua", query[i].NgaySua);

                var qR = _context.RoleDonVis.Where(o => o.DonViId == query[i].DonViId).ToList();
                if (qR.Count() > 0)
                {
                    JArray jA = new JArray();
                    for (int j = 0; j < qR.Count(); j++)
                    {
                        JObject jO = new JObject();
                        jO.Add("roleDonViId", qR[j].RoleDonViId);
                        jO.Add("roleId", qR[j].RoleId);
                        jO.Add("donViId", qR[j].DonViId);
                        jO.Add("roleName", qR[j].RoleName);
                        jA.Add(jO);
                    }
                    jObject.Add("roleDonVi", jA);
                }

                loadChidNode(query[i].DonViId, jObject, jArray);
                jArray.Add(jObject);

            }
            return jArray;
        }


        private JObject loadChidNode(int parentNode, JObject jObject, JArray jArray)
        {
            var query1 = _context.DonVis.Where(m => m.MaDonViCha == parentNode).OrderBy(o => o.ViTri).ToList();
            if (query1.Count() > 0)
            {
                JObject jObject1 = new JObject();
                JArray jArray1 = new JArray();
                for (var i = 0; i < query1.Count(); i++)
                {
                    jObject1 = new JObject();
                    jObject1.Add("donViId", query1[i].DonViId);
                    jObject1.Add("tenDonVi", query1[i].TenDonVi);
                    jObject1.Add("maDonViCha", query1[i].MaDonViCha);
                    jObject1.Add("kyHieu", query1[i].KyHieu);
                    jObject1.Add("subLv", query1[i].SubLv);
                    jObject1.Add("ngonNgu", query1[i].NgonNgu);
                    jObject1.Add("viTri", query1[i].ViTri);
                    jObject1.Add("dienGiai", query1[i].DienGiai);
                    jObject1.Add("trangThai", query1[i].TrangThai);
                    jObject1.Add("nguoiNhap", query1[i].NguoiNhap);
                    jObject1.Add("ngayNhap", query1[i].NgayNhap);
                    jObject1.Add("nguoiSua", query1[i].NguoiSua);
                    jObject1.Add("ngaySua", query1[i].NgaySua);

                    var qR = _context.RoleDonVis.Where(o => o.DonViId == query1[i].DonViId).ToList();
                    if (qR.Count() > 0)
                    {
                        JArray jA = new JArray();
                        for (int j = 0; j < qR.Count(); j++)
                        {
                            JObject jO = new JObject();
                            jO.Add("roleDonViId", qR[j].RoleDonViId);
                            jO.Add("roleId", qR[j].RoleId);
                            jO.Add("donViId", qR[j].DonViId);
                            jO.Add("roleName", qR[j].RoleName);
                            jA.Add(jO);
                        }
                        jObject1.Add("roleDonVi", jA);
                    }

                    loadChidNode(query1[i].DonViId, jObject1, jArray1);
                    jArray1.Add(jObject1);
                }
                jObject.Add("items", jArray1);
            }
            return jObject;

        }


        // GET: api/DonVis/getMaxViTri
        [HttpGet("getMaxViTri")]
        public IActionResult getMaxViTri()
        {
            return Ok(_context.DonVis.OrderByDescending(p => p.ViTri).FirstOrDefault());
        }
        // GET: api/DonVis/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDonVi([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var donvi = await _context.DonVis.SingleOrDefaultAsync(m => m.DonViId == id);

            if (donvi == null)
            {
                return NotFound();
            }

            return Ok(donvi);
        }

        // PUT: api/DonVis/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDonVi([FromRoute] int id, [FromBody] DonVi donvi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != donvi.DonViId)
            {
                return BadRequest();
            }

            _context.Entry(donvi).State = EntityState.Modified;

            try
            {

                await _context.SaveChangesAsync();
                await updatechidAsync(donvi);

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DonViExists(id))
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

        public async Task updatechidAsync(DonVi donvi)
        {
            var data = _context.DonVis.Where(row => row.MaDonViCha == donvi.DonViId).ToList();
            if (data != null && data.Count() > 0)
            {
                for (var i = 0; i < data.Count(); i++)
                {
                    data[i].TrangThai = donvi.TrangThai;
                    await _context.SaveChangesAsync();
                    await updatechidAsync(data[i]);
                }
            }
        }

        // POST: api/DonVis
        [HttpPost]
        public async Task<IActionResult> PostDonVi([FromBody] DonVi donvi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.DonVis.Add(donvi);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDonVi", new { id = donvi.DonViId }, donvi);
        }

        // DELETE: api/DonVis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonVi([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var donvi = await _context.DonVis.SingleOrDefaultAsync(m => m.DonViId == id);
            if (donvi == null)
            {
                return NotFound();
            }
            await deletechidAsync(donvi);
            _context.DonVis.Remove(donvi);
            await _context.SaveChangesAsync();

            return Ok(donvi);
        }


        public async Task deletechidAsync(DonVi donvi)
        {
            var data = _context.DonVis.Where(row => row.MaDonViCha == donvi.DonViId).ToList();
            if (data != null && data.Count() > 0)
            {
                for (var i = 0; i < data.Count(); i++)
                {
                    await deletechidAsync(data[i]);
                    _context.DonVis.Remove(data[i]);
                    await _context.SaveChangesAsync();
                }
            }
        }


        // DELETE: api/DonVis/deleteMore
        [HttpPut("deleteMore")]
        public async Task<IActionResult> DeleteMoreDonVi([FromBody] int[] listId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var donvi = _context.DonVis.Where(result => listId.Contains(result.DonViId)).ToList();
            if (donvi == null)
            {
                return NotFound();
            }

            _context.DonVis.RemoveRange(donvi);
            await _context.SaveChangesAsync();

            return Ok(donvi);
        }

        // Check trùng: api/DonVis/checkExitsItems
        [HttpPut("checkExitsItems")]
        public IActionResult checkExitsItems([FromBody] string value)
        {
            string[] p = value.Split(',');
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (p.Length > 1)
            {
                var donvi = _context.DonVis.Where(m => m.TenDonVi == p[0] && m.MaDonViCha == Convert.ToInt32(p[1]));
                if (donvi.Count() > 0)
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            else
            {
                return Ok(false);
            }

        }

        private bool DonViExists(int id)
        {
            return _context.DonVis.Any(e => e.DonViId == id);
        }
    }
}