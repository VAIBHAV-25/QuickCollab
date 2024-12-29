import { FormEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { socket } from '@/common/lib/socket';
import { useModal } from '@/common/recoil/modal';
import { useSetRoomId } from '@/common/recoil/room';
import NotFoundModal from '@/modules/home/modals/NotFound';

const NameInput = () => {
	const setRoomId = useSetRoomId();
	const { openModal } = useModal();

	const [name, setName] = useState('');

	const router = useRouter();
	const roomId = (router.query.roomId || '').toString();

	useEffect(() => {
		if (!roomId) return;

		socket.emit('check_room', roomId);

		socket.on('room_exists', (exists) => {
			if (!exists) {
				router.push('/');
			}
		});

		// eslint-disable-next-line consistent-return
		return () => {
			socket.off('room_exists');
		};
	}, [roomId, router]);

	useEffect(() => {
		const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
			if (failed) {
				router.push('/');
				openModal(<NotFoundModal id={roomIdFromServer} />);
			} else setRoomId(roomIdFromServer);
		};

		socket.on('joined', handleJoined);

		return () => {
			socket.off('joined', handleJoined);
		};
	}, [openModal, router, setRoomId]);

	const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		socket.emit('join_room', roomId, name);
	};

	return (
		<form
			className='my-24 flex flex-col items-center'
			onSubmit={handleJoinRoom}
		>
			<h1 className='text-5xl font-extrabold leading-tight text-[#023047] sm:text-[60px]'>QuickCollab</h1>
			<h3 className='text-xl text-[#023e8a] sm:text-2xl'>Real-time collaborative whiteboard</h3>

			<div className='mt-[60px] mb-3 flex w-[40%] flex-col gap-2'>
				<label className='self-start font-bold leading-tight text-[#023e8a]'>Enter your name</label>
				<input
					className='rounded-xl border p-5 py-1'
					id='room-id'
					placeholder='Username...'
					value={name}
					onChange={(e) => setName(e.target.value.slice(0, 15))}
				/>
			</div>

			<button
				className='btn bg-[#023e8a]'
				type='submit'
			>
				Enter room
			</button>
		</form>
	);
};

export default NameInput;
