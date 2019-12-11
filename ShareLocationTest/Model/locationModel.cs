using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic; 
using System.Linq;
using System.Threading.Tasks;

namespace ShareLocationTest.Model
{
    public class locationModel
    {
        public int Id { set; get; }
        public string LocName { set; get; }
        public int Type { set; get; }
        public string Logo { set; get; }
        public double Lat { set; get; }
        public double Lng { set; get; }

    }
}
