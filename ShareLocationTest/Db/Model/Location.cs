using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShareLocationTest.Db
{
    public class Location
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public double Lat { set; get; }
        public double Lng { set; get; }
        /// <summary>
        /// type = 1 Business
        /// type = 2 Health Center
        /// </summary>
        public int Type { set; get; }
        public string Logo { set; get; }
    }
}
