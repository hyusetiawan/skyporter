importScripts('sql.js', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js')

var db = null
var getRows = function(r, cb){
    r = r[0]
    var columns = r.columns
    var values = r.values

    for(var i = 0; i < values.length; i++){
        var value = values[i]
        var row = {}
        for(var j = 0; j < columns.length; j++){
            var column = columns[j]
            row[column] = value[j]
        }
        cb(row)
    }
}

self.onmessage = function(e){
    var msg = e.data

    switch(msg.cmd){
        case 'init':
            var dbfile = msg.file
            var r = new FileReader();
            r.onload = function() {
                var Uints = new Uint8Array(r.result);
                db = new SQL.Database(Uints);
                postMessage({cmd: 'ready'})
            }
            r.readAsArrayBuffer(dbfile);
            break

        case 'videos':
            var page = msg.page - 1
            var perPage = msg.per
            var videos = db.exec(`SELECT vod_path, author, creation_timestamp FROM VideoMessages
                                  ORDER BY creation_timestamp DESC LIMIT ${page * perPage}, ${perPage}`)

            videos = getRows(videos, function(r){
                r.creation_timestamp = moment(r.creation_timestamp * 1000).format('MMM Do YYYY, h:mmA')
                postMessage({item: r, cmd: 'videos'})
            })
            break
    }
}