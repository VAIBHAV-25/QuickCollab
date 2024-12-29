import { FormEvent, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { socket } from '@/common/lib/socket';
import { useModal } from '@/common/recoil/modal';
import { useSetRoomId } from '@/common/recoil/room';

import NotFoundModal from '../modals/NotFound';

const Home = () => {
	const { openModal } = useModal();
	const setAtomRoomId = useSetRoomId();

	const [roomId, setRoomId] = useState('');
	const [username, setUsername] = useState('');

	const router = useRouter();

	useEffect(() => {
		document.body.style.backgroundColor = 'white';
	}, []);

	useEffect(() => {
		socket.on('created', (roomIdFromServer) => {
			setAtomRoomId(roomIdFromServer);
			router.push(roomIdFromServer);
		});

		const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
			if (!failed) {
				setAtomRoomId(roomIdFromServer);
				router.push(roomIdFromServer);
			} else {
				openModal(<NotFoundModal id={roomId} />);
			}
		};

		socket.on('joined', handleJoinedRoom);

		return () => {
			socket.off('created');
			socket.off('joined', handleJoinedRoom);
		};
	}, [openModal, roomId, router, setAtomRoomId]);

	useEffect(() => {
		socket.emit('leave_room');
		setAtomRoomId('');
	}, [setAtomRoomId]);

	const handleCreateRoom = () => {
		socket.emit('create_room', username);
	};

	const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (roomId) socket.emit('join_room', roomId, username);
	};

	return (
		<div className='flex items-center py-24'>
			<div className='flex w-[50%] flex-col items-center justify-center gap-y-8'>
				<h1 className='text-5xl font-extrabold leading-tight text-[#023047] sm:text-[60px]'>QuickCollab</h1>
				<h3 className='-mt-4 text-xl text-[#023e8a] sm:text-2xl'>Real-time collaborative whiteboard</h3>
				<Image
					src='/assets/whiteboard.svg'
					alt=''
					height={400}
					width={400}
				/>
			</div>

			<div className='flex w-[50%] flex-col items-start justify-center px-6'>
				<div className='mt-10 flex w-full flex-col gap-2'>
					<label className='self-start font-bold leading-tight text-[#023047]'>Enter your name</label>
					<input
						className='input w-[60%]'
						id='room-id'
						placeholder='Username...'
						value={username}
						onChange={(e) => setUsername(e.target.value.slice(0, 15))}
					/>
				</div>

				{/* <div className='my-8 h-px w-96 bg-zinc-200' /> */}
				<div className='mt-6 flex justify-end'>
					<button
						className='btn bg-[#023e8a]'
						onClick={handleCreateRoom}
					>
						Create new room
					</button>
				</div>

				<div className='my-8 flex w-96 items-center gap-2'>
					<div className='h-px w-full bg-zinc-200' />
					<p className='text-zinc-400'>or</p>
					<div className='h-px w-full bg-zinc-200' />
				</div>
				<form
					className='flex w-full flex-col items-start gap-3'
					onSubmit={handleJoinRoom}
				>
					<label
						htmlFor='room-id'
						className='self-start font-bold leading-tight text-[#023047]'
					>
						Join existing room
					</label>
					<div className='flex w-full justify-start gap-x-2'>
						<input
							className='input w-[48%]'
							id='room-id'
							placeholder='Room id...'
							value={roomId}
							onChange={(e) => setRoomId(e.target.value)}
						/>
						<button
							className='btn bg-[#023e8a]'
							type='submit'
						>
							Join
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Home;
