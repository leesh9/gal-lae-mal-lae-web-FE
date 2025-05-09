"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import "@/styles/travelgroups/travelgroups-style.css";
import { deleteTravel } from '@/lib/travelgroup-api';

export default function TravelListView({ travelList }: { travelList: any[] }) {
    const router = useRouter();
    const [list, setList] = useState(travelList);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTravelIdx, setSelectedTravelIdx] = useState<number | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);  // isAdmin 상태 추가

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedMemberList = JSON.parse(localStorage.getItem("memberList") || "[]");
            const storedUserData = JSON.parse(localStorage.getItem("user") || "{}");

            // isAdmin 판별 로직
            const adminCheck = storedMemberList.some((member: any) =>
                member.usIdx === storedUserData.usIdx && member.meRole === "ADMIN"
            );

            setIsAdmin(adminCheck);  // isAdmin 상태 업데이트
        }
    }, []);

    const handleDeleteClick = (trIdx: number) => {
        setSelectedTravelIdx(trIdx);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (selectedTravelIdx !== null) {
            deleteTravel(selectedTravelIdx);
            setList(list.filter(travel => travel.trIdx !== selectedTravelIdx));
        }
        setIsDeleteModalOpen(false);
        setSelectedTravelIdx(null);
    };

    return (
        <div>
            {list.map((travel) => (
                <div className="travel-list-view" style={{ cursor: 'pointer' }} key={travel.trIdx} onClick={() => {
                    localStorage.setItem('trIdx', travel.trIdx.toString());
                    router.push("/travelgroups/travel/get");
                }}>
                    <div className="travel-list-view-text">
                        <span>{travel.ldName} {travel.lsName}</span>
                        
                        {/* isAdmin이 true일 때만 삭제 아이콘 표시 */}
                        {isAdmin && (
                            <img className="delete-icon" src="/travelgroups/delete.svg" alt="delete" style={{objectFit:'contain'}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(travel.trIdx);
                                }} />
                        )}
                    </div>

                    {travel.tlImgList.length === 0 && (
                        <div className="travel-list-img-view">
                            <img className="travel-list-img" src="/travelgroups/travelView.png" alt="travelImg" style={{ width: '100%'}} />
                        </div>
                    )}

                    {travel.tlImgList.length === 1 && (
                        <div className="travel-list-img-view">
                            <img className="travel-list-img" src={`/s3/${travel.tlImgList[0]}`} alt={travel.tlImgList[0]}  />
                            <img className="travel-list-img" src="/travelgroups/travelView.png" alt="travelImg"/>
                        </div>
                    )}

                    {travel.tlImgList.length > 1 && (
                        <div className="travel-list-img-view">
                            {travel.tlImgList.map((img: string) => (
                                <img className="travel-list-img" src={`/s3/${img}`} alt={img} key={img} style={{  }} />
                            ))}
                        </div>
                    )}

                    <div className="travelgroup-container">
                        <div id="scroll-bar" className="travel-list-img-bar"></div>
                    </div>
                </div>
            ))}

            {/* 삭제 확인 모달 */}
            {isDeleteModalOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: '1000'
                }}>
                    <div className="modal" style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        width: '90%',
                        height: '140px'
                    }}>
                        <p>정말로 삭제하시겠어요?</p>
                        <div style={{ marginTop: '20px' }}>
                            <button className="nomal-button" onClick={confirmDelete}>삭제</button>
                            <button className="active-button" onClick={() => setIsDeleteModalOpen(false)} style={{ marginLeft: '10px' }}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            <br />
            <br />
        </div>
    );
}
