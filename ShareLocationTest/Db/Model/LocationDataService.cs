using ShareLocationTest.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ShareLocationTest.Db.Model
{
    public class LocationDataService
    {
        readonly MyDbContext _db;
        public LocationDataService(MyDbContext db)
        {
            _db = db;
        }
        public int AddLocation(locationModel loc)
        {
            try
            { 
                Location Location = new Location()
                {
                    Id = loc.Id,
                    Lat = loc.Lat,
                    Lng = loc.Lng,
                    Name = loc.LocName,
                    Type = loc.Type,
                    Logo = loc.Logo
                };
                _db.Locations.Add(Location);
                _db.SaveChanges();
                return 1;
            }
            catch(Exception ex)
            {
                throw;
            }
        }
        public IEnumerable<locationModel> GetAll()
        {
            try
            {
                return _db.Locations.Select(x => new locationModel()
                {
                    Id = x.Id,
                    Lat = x.Lat,
                    Lng = x.Lng,
                    LocName = x.Name,
                    Logo = x.Logo,
                    Type = x.Type
                }).ToList();
            }
            catch
            {
                throw;
            }
        }
        public Location Get(int id)
        {
            try
            {
                return _db.Locations.Find(id);
            }
            catch
            {
                throw;
            }
        }

    }
}
