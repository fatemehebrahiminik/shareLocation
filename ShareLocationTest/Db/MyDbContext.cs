using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShareLocationTest.Db
{
    public class MyDbContext: DbContext
    {
        public DbSet<Location> Locations { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source=NIK\KHALIL;Initial Catalog=LocationDB;Trusted_Connection=True;");
        }
    }
}
