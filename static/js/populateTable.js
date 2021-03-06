function populateTable(data)
{
        tbod = document.getElementsByTagName("tbody");
        otbod = tbod[0];
        for(var i = 0; i < data.length; i++){
                var trow = document.createElement("tr");

                //Title
                var tdat = document.createElement("td");
                tdat.appendChild(document.createTextNode(data[i].name));
                trow.appendChild(tdat);

                //Description
                tdat = document.createElement("td");
                tdat.appendChild(document.createTextNode(data[i].desc));
                trow.appendChild(tdat);

                //Start Time
                tdat = document.createElement("td");
                var stime = data[i].starttime.split(" ");
                var stimesec = stime[1].split(":");
                var startim = stimesec[0] + ":" + stimesec[1];
                tdat.appendChild(document.createTextNode(startim));
                trow.appendChild(tdat);

                //End Time
                tdat = document.createElement("td");
                var etime = data[i].endtime.split(" ");
                var etimesec = etime[1].split(":");
                var endtim = etimesec[0] + ":" + etimesec[1];
                tdat.appendChild(document.createTextNode(endtim));
                trow.appendChild(tdat);

                //Distance(miles)
                tdat = document.createElement("td");
                tdat.appendChild(document.createTextNode(Math.ceil(data[i].dist*10)*2));
                                 //this calculates time to location as crow flies in 
                                 // minutes assuming 3mph
                                 //takes miles multiplies by 10 truncates /10 *60/3 for minutes per mile. 
                                 // which reduces to *2
                trow.appendChild(tdat);

                otbod.appendChild(trow);

        }
}
