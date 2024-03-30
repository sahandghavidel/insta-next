'use client';

import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { app } from '../firebase';

export default function LikeSection({ id }) {
  const { data: session } = useSession();
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => {
      setLikes(snapshot.docs);
    });
  }, [db]);

  useEffect(() => {
    if (likes.findIndex((like) => like.id === session?.user?.uid) !== -1) {
      setHasLiked(true);
    } else {
      setHasLiked(false);
    }
  }, [likes]);

  async function likePost() {
    console.log(db, id, 'likes', session?.user?.uid);
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session?.user?.uid));
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session?.user?.uid), {
        username: session?.user?.username,
      });
    }
  }

  return (
    <div>
      {session && (
        <div className='flex border-t border-gray-100 px-4 pt-4'>
          <div className='flex items-center gap-2'>
            {hasLiked ? (
              <HiHeart
                onClick={likePost}
                className='text-red-500 cursor-pointer text-3xl  hover:scale-125 transition-transform duration-200 ease-out'
              />
            ) : (
              <HiOutlineHeart
                onClick={likePost}
                className='cursor-pointer text-3xl  hover:scale-125 transition-transform duration-200 ease-out'
              />
            )}
            {likes.length > 0 && (
              <p className='text-gray-500'>
                {likes.length} {likes.length === 1 ? 'like' : 'likes'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
