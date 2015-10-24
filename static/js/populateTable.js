function populateTable(data)
{
        var tbod = document.getElementsbyTagName("tbody");
        for(int i = 0; i < data.length; i++){
                trow = document.createElement("tr");

                //Title
                tdat = docmunt.createElement("td");
                tdat.appendChild(document.createTextNode(data[i].name));
                trow.appendChild(tdat);

                //Description
                tdat = docmunt.createElement("td");
                tdat.appendChild(document.createTextNode(data[i].desc));
                trow.appendChild(tdat);

                //Start Time
                tdat = docmunt.createElement("td");
                var stime = data[i].starttime.split(" ");
                var stimesec = stime[1].split(":");
                var startim = stimesec[0] + ":" + stimesec[1];
                tdat.appendChild(document.createTextNode(startim));
                trow.appendChild(tdat);

                //End Time
                tdat = docmunt.createElement("td");
                var etime = data[i].starttime.split(" ");
                var etimesec = etime[1].split(":");
                var endtim = etimesec[0] + ":" + etimesec[1];
                tdat.appendChild(document.createTextNode(endtim));
                trow.appendChild(tdat);

                //Distance(miles)
                tdat = docmunt.createElement("td");
                tdat.appendChild(document.createTextNode(data[i].dist));
                trow.appendChild(tdat);

                tbod.appendChild(trow);

        }
}