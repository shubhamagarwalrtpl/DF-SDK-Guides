import clickSound from '../';

class DataService {

    static playClickAudio() {
        let audio = new Audio('data:audio/mp3;base64,' + clickSound.base64);
        audio.play();
    }
}

export default DataService;