function populateTable(data)
{
        console.log(data);
        var tbod = document.getElementById("tabpart");
        console.log(data)
        for(var i = 0; i < data.length; i++){
                console.log(data[i]);
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
                tdat.appendChild(document.createTextNode(data[i].dist));
                trow.appendChild(tdat);

                tbod.appendChild(trow);

        }
}