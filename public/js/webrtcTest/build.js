var bundle = require('browserify')(),
    fs = require('fs');

bundle.add('./webrtc.js');
bundle.bundle({standalone: 'WebRTC'}, function (err, source) {
    if (err) console.error(err);
    fs.writeFileSync('bundle.js', source);
});
