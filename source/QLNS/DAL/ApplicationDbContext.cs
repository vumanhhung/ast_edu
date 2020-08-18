﻿using DAL.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using DAL.Models.Interfaces;
using System.Data;
using System.Collections;

namespace DAL
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public string CurrentUserId { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<DonVi> DonVis { get; set; }     
        public DbSet<RoleDonVi> RoleDonVis { get; set; }        
        public DbSet<Log> Logs { get; set; }

        //Begin hungvm
        public DbSet<QuanHuyen> QuanHuyens { get; set; }
        public DbSet<TinhThanh> TinhThanhs { get; set; }
        public DbSet<QuocGia> QuocGias { get; set; }
        public DbSet<DoiTac> DoiTacs { get; set; }
        public DbSet<BacLuong> BacLuongs { get; set; }
        public DbSet<GioiTinh> GioiTinhs { get; set; }
        public DbSet<ChucDanh> ChucDanhs { get; set; }
        public DbSet<ChamCong> ChamCongs { get; set; }
        //End hungvm

        public ApplicationDbContext(DbContextOptions options) : base(options)
        { }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().HasMany(u => u.Claims).WithOne().HasForeignKey(c => c.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ApplicationUser>().HasMany(u => u.Roles).WithOne().HasForeignKey(r => r.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ApplicationRole>().HasMany(r => r.Claims).WithOne().HasForeignKey(c => c.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ApplicationRole>().HasMany(r => r.Users).WithOne().HasForeignKey(r => r.RoleId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Customer>().Property(c => c.Name).IsRequired().HasMaxLength(100);
            builder.Entity<Customer>().HasIndex(c => c.Name);
            builder.Entity<Customer>().Property(c => c.Email).HasMaxLength(100);
            builder.Entity<Customer>().Property(c => c.PhoneNumber).IsUnicode(false).HasMaxLength(30);
            builder.Entity<Customer>().Property(c => c.City).HasMaxLength(50);
            builder.Entity<Customer>().ToTable($"App{nameof(this.Customers)}");
            builder.Entity<ProductCategory>().Property(p => p.Name).IsRequired().HasMaxLength(100);
            builder.Entity<ProductCategory>().Property(p => p.Description).HasMaxLength(500);
            builder.Entity<ProductCategory>().ToTable($"App{nameof(this.ProductCategories)}");
            builder.Entity<Product>().Property(p => p.Name).IsRequired().HasMaxLength(100);
            builder.Entity<Product>().HasIndex(p => p.Name);
            builder.Entity<Product>().Property(p => p.Description).HasMaxLength(500);
            builder.Entity<Product>().Property(p => p.Icon).IsUnicode(false).HasMaxLength(256);
            builder.Entity<Product>().HasOne(p => p.Parent).WithMany(p => p.Children).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Product>().ToTable($"App{nameof(this.Products)}");
            builder.Entity<Order>().Property(o => o.Comments).HasMaxLength(500);
            builder.Entity<Order>().ToTable($"App{nameof(this.Orders)}");
            builder.Entity<OrderDetail>().ToTable($"App{nameof(this.OrderDetails)}");        
            builder.Entity<Notification>().ToTable($"tbl_Notifications");

            builder.Entity<DonVi>().ToTable($"tbl_DonVi");          
            builder.Entity<RoleDonVi>().ToTable($"tbl_RoleDonVi");            
            builder.Entity<Log>().ToTable($"tbl_Log");

            //Begin hungvm
            builder.Entity<ChucDanh>().ToTable($"tbl_ChucDanh");
            builder.Entity<QuanHuyen>().ToTable($"tbl_QuanHuyen");
            builder.Entity<TinhThanh>().ToTable($"tbl_TinhThanh");
            builder.Entity<QuocGia>().ToTable($"tbl_QuocGia");
            builder.Entity<GioiTinh>().ToTable($"tbl_GioiTinh");
            builder.Entity<BacLuong>().ToTable($"tbl_BacLuong");
            builder.Entity<DoiTac>().ToTable($"tbl_DoiTac");
            builder.Entity<ChamCong>().ToTable($"tbl_ChamCong");
            //End hungvm         
        }

        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }


        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }


        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }


        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }


        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));


            foreach (var entry in modifiedEntries)
            {
                var entity = (IAuditableEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }

                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }
         
    }
}
