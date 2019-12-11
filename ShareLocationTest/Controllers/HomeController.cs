using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using ShareLocationTest.Db;
using ShareLocationTest.Db.Model;
using ShareLocationTest.Model;

namespace ShareLocationTest.Controllers
{
    public class HomeController : Controller
    {
        LocationDataService LocationDataAccessLayer;
        public HomeController(MyDbContext db)
        {
            LocationDataAccessLayer = new LocationDataService(db);
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
        /// <summary>
        /// get all location in db
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("api/Location/GetAll")]
        public IEnumerable<locationModel> GetAll()
        {
            return LocationDataAccessLayer.GetAll();
        }
        /// <summary>
        /// get location detail from db
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/Location/Get")]
        public Db.Location Get(int id)
        {
            return LocationDataAccessLayer.Get(id);
        }
        /// <summary>
        /// add location to db
        /// </summary>
        /// <param name="location"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/Location/AddLocation")]
        public int AddLocation([FromBody]locationModel location)
        {
            return LocationDataAccessLayer.AddLocation(location);
        }
    }
}
