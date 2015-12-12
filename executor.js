riot.tag2('executor', '<div class="{\'animated bounceInLeft\': mainDB}" if="{mainDB}"> <h4 if="{!videos}">Loading Database ... </h4> <table id="videos-list" if="{videos.length}"> <thead> <tr> <th>From</th> <th>When</th> <th>Link</th> </tr> </thead> <tbody> <tr each="{video, i in videos}" no-reorder> <td class="author">{video.author}</td> <td class="timestamp">{video.creation_timestamp}</td> <td class="link"><a target="new_{i}" href="{video.vod_path}">VIDEO</a></td> </tr> </tbody> </table> <div class="pagination"> <a href="#"></a> </div> </div>', '', '', function(opts) {

    var self = this
    var worker = new Worker('db.js')
    var PER_PAGE = 100
    self.counter = 0
    this.videos = []
    var debounced = _.debounce(function(){
        self.update()
    }, 500, {leading: true})
    worker.onmessage = function(e){
        var msg = e.data

        switch(msg.cmd){
            case 'ready':
                worker.postMessage({cmd: 'videos', page: 1, per: PER_PAGE})
                break
            case 'videos':
                this.videos.push(msg.item)
                debounced()
                break
        }
    }.bind(this)

    PubSub.subscribe('uploader.maindb', function(path, maindb){
        self.mainDB = maindb
        worker.postMessage({cmd: 'init', file: maindb})
        self.update()
    })
    this.mixin(riotAnimate)
}, '{ }');