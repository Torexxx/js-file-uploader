import firebase from 'firebase/app';
import 'firebase/storage'
import {upload} from './upload';

const firebaseConfig = {
    apiKey: "AIzaSyBHQY7Tjaj2gzts7ZO4DDZ5EfvhD_mdLnA",
    authDomain: "fe-upload-fd17c.firebaseapp.com",
    projectId: "fe-upload-fd17c",
    storageBucket: "fe-upload-fd17c.appspot.com",
    messagingSenderId: "84107645040",
    appId: "1:84107645040:web:e43caa10fcd4eadb6e64b5"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg','.gif'],
    onUpload(files, blocks) {
        files.forEach((file, idx) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file);

            task.on('state_changed', snapshot => {
                const percentage = (snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0) + '%';
                const block = blocks[idx].querySelector('.preview-info-progress');

                block.style.width = percentage;
                block.textContent = percentage;

            }, error => {
                console.log(error)
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL', url);
                })
            })
        })
    }
});
