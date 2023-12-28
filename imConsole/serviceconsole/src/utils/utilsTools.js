import md5 from 'js-md5'
const md5Key = 'East Chang an Avenue, Dongcheng District, Beijing'
const noticeAudio = new Audio('http://172.61.10.9:9000/customerservice/common/notice.mp3')

function Md5(res) {
  return md5(res + md5Key)
}

function awaitMillisecond(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}

function playNoticeAudioAuido() {
  noticeAudio.play();
}


export {
  Md5,
  awaitMillisecond,
  playNoticeAudioAuido,
}
