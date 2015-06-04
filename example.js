var min = require("./");
console.log(min.reduce({
    "sdp":"v=0\r\no=- 5569982971256804497 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 53110 DTLS/SCTP 5000\r\nc=IN IP4 142.254.26.9\r\na=candidate:3338612916 1 udp 2122194687 192.168.186.18 53110 typ host generation 0\r\na=candidate:2289880132 1 tcp 1518214911 192.168.186.18 0 typ host tcptype active generation 0\r\na=candidate:175247143 1 udp 1685987071 142.254.26.9 53110 typ srflx raddr 192.168.186.18 rport 53110 generation 0\r\na=ice-ufrag:tCjVOmVGpVZjCem/\r\na=ice-pwd:dOU77RWjJ8qQNb5OTz6D+U7h\r\na=ice-options:google-ice\r\na=fingerprint:sha-256 AE:DB:BE:7E:9B:17:45:A7:A5:54:40:A8:66:19:11:5C:F2:34:C8:0A:B9:85:32:70:09:2E:A9:91:A2:82:E8:71\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n",
    "type":"offer"
}));
