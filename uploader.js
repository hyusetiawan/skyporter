<uploader>
<ol if={!hasMainDB} riot-leave="bounceOutRight" id="steps" ondrop={onDrop} ondragover={onDragOver}
    ondragenter={onDragEnter} ondragleave={onDragLeave} class={'dragging': isDragging}>
    <li>
        <p>Fill the following input to get the location where your Skype data is located</p>
        <input name="osname" value="{osname}" onkeyup={onDirChange} type="text" placeholder="your computer username" />
        <input name="username" value="{username}" onkeyup={onDirChange} type="text" placeholder="your skype username" />
        <input id="save-button" onclick={onSaveButton} type="button" value="save names" /> <br />
        <div class="db-path" show={username && osname}>
            <span>{mainDBPath}</span>
            <input id="copy-button" type="button" value="copy" />
        </div>
    </li>
    <li>
        Copy the path above and paste it to open the folder, to find a file called "main.db" like so:
        <img class="guide" riot-src="img/{os}/open-folder.png" />
    </li>
    <li>
        Drag and drop the main.db from that folder, to this window.
    </li>
</ol>
this.mixin(riotAnimate)
var os="Unknown OS";
if (navigator.appVersion.indexOf("Win")!=-1) os="win";
if (navigator.appVersion.indexOf("Mac")!=-1) os="mac";
if (navigator.appVersion.indexOf("X11")!=-1) os="unix";
if (navigator.appVersion.indexOf("Linux")!=-1) os="linux";

this.os = os
var $state = opts.$state
var state = $state.get()
state = state?state:{}
this.osname = state.osname?state.osname: null
this.username = state.username?state.osname: null

var self = this
var dbPaths = {
    win: 'C:\\Users\\{osname}\\AppData\\Roaming\\Skype\\{username}\\',
    mac: '/Users/{osname}/Library/Application Support/Skype/{username}/'
}

onDirChange(e) {
    if(e) this[e.target.name] = e.target.value
    this.mainDBPath = (dbPaths[this.os] + '').replace('{osname}', this.osname).replace('{username}', this.username)
}

onDragEnter(e) {
    e.preventDefault()
    this.isDragging = true
}

onDragOver(e) {
    e.preventDefault()
    this.isDragging = true
}

onDrop(e){
    this.isDragging = false
    e.stopPropagation()
    e.preventDefault()
    var mainDB = e.dataTransfer.files[0]
    this.hasMainDB = true
    PubSub.publish('uploader.maindb', mainDB)
}

onDragLeave(e) {
    e.preventDefault()
    this.isDragging = false
}

onSaveButton(e) {
    $state.set({
        osname: this.osname,
        username: this.username
    })
}

this.on('mount', function(){
    var copyButton = new Clipboard('#copy-button', {
        text: function(){
            return self.mainDBPath
        }
    })
})

this.onDirChange()
</uploader>