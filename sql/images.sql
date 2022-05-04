DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS comments;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    text VARCHAR NOT NULL,
    username VARCHAR NOT NULL,  
    image_id   INTEGER NOT NULL REFERENCES images (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (text, username, image_id) VALUES (
    'blablablablablablabla',
    'funkychicken',
    3
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/6_LkppyF_hevRtJptyg4c4-K7WUrZAs9.png',
    'Klaus',
    'Pap',
    'Oil Painting 20 x 30'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/KbglU24ImwcrOlAxNgZXH6RsoajtccjQ.png',
    'Klaus',
    'Mom',
    'Oil Painting 20 x 30'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/iA_0NgZf1oCkFOjnd4mpsVU7UT94Dg1v.png',
    'Klaus',
    'Self-Portrait',
    'Oil Painting 40 x 30'
);