import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';
import { QRCodeCanvas } from 'qrcode.react';
import logo from '../../assets/images/logo.png';
import ReactConfetti from 'react-confetti';

interface Election {
  electionid: number;
  title: string;
  type: string;
  date: string;
  location_region: string;
  status: string;
}

interface Candidate {
  cid: number;
  name: string;
  partyid?: number;
  partyname?: string;
  symbol_url?: string;
}

interface Props {
  election: Election;
  candidates: Candidate[];
  onClose: () => void;
}

const ElectionDetails: React.FC<Props> = ({ election, candidates, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteStatus, setVoteStatus] = useState<{ voted: boolean; vote?: any } | null>(null);
  const [voting, setVoting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [docSuccess, setDocSuccess] = useState(false);
  const [pngLoading, setPngLoading] = useState(false);
  const [pngSuccess, setPngSuccess] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  console.log('ElectionDetails component received election prop:', election);

  useEffect(() => {
    const fetchVoteStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user && user.vid && election.electionid) {
          const statusRes = await fetch(`/api/elections/${election.electionid}/vote-status/${user.vid}`);
          const statusData = await statusRes.json();
          setVoteStatus(statusData);
        } else {
          setVoteStatus(null);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching vote status');
      } finally {
        setLoading(false);
      }
    };
    if (election) fetchVoteStatus();
  }, [election, user]);

  const handleVote = async (candidateid: number) => {
    if (!user) return;
    setVoting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterid: user.vid || user.id,
          electionid: election.electionid,
          candidateid
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to vote');
      setSuccess('Vote cast successfully!');
      setVoteStatus({ voted: true, vote: { candidateid } });
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      setTimeout(() => setShowReceipt(true), 600); // Show receipt after animation
    } catch (err: any) {
      setError(err.message || 'Error casting vote');
    } finally {
      setVoting(false);
    }
  };

  // Drag and Drop handlers
  const onDragStart = (candidate: Candidate) => {
    if (voteStatus?.voted) return;
    setDraggedCandidate(candidate);
  };
  const onDragEnd = () => {
    setDraggedCandidate(null);
    setIsOver(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!voteStatus?.voted) setIsOver(true);
  };
  const onDragLeave = () => {
    setIsOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (draggedCandidate && !voteStatus?.voted) {
      handleVote(draggedCandidate.cid);
      setDraggedCandidate(null);
    }
  };

  const votedCandidate = candidates.find(c => c.cid === voteStatus?.vote?.candidateid);

  // Helper to generate a unique receipt ID
  const getReceiptId = () => {
    return `EVC-${election.location_region?.slice(0,3).toUpperCase() || 'LOC'}-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${user?.vid || 'VID'}`;
  };

  // Helper to generate QR code value (encode receipt info)
  const getQRValue = () => {
    return JSON.stringify({
      voter: user?.name,
      voterid: user?.vid,
      election: election.title,
      type: election.type,
      date: new Date().toLocaleDateString(),
      receiptId: getReceiptId(),
    });
  };

  // Helper to generate receipt text (for PDF/DOC)
  const getReceiptText = () => {
    return `Election Commission of India\nVOTER CONFIRMATION RECEIPT\n\nVoter Name: ${user?.name}\nVoter ID: ${user?.vid}\nConstituency: ${election.location_region}\nElection Type: ${election.type}\nDate of Vote: ${new Date().toLocaleDateString()}\nVoted For: ${votedCandidate?.name || 'Hidden'}\n\nYOU HAVE SUCCESSFULLY CAST YOUR VOTE!\nYour vote has been securely recorded in Electronic Voting Machine (EVM).\n\nNote: Your vote is your right and a powerful tool for change. Thank you for participating in strengthening Indian democracy.\n\nReceipt ID: ${getReceiptId()}\n\nThis receipt is computer-generated and requires no signature.`;
  };

  // PDF Download (screenshot-based)
  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true);
      setPdfSuccess(false);
      console.log('PDF download clicked');
      const receiptElement = document.getElementById('receipt-area');
      if (!receiptElement) {
        alert('Receipt area not found!');
        setPdfLoading(false);
        return;
      }
      // Animation delay before download
      await new Promise(res => setTimeout(res, 3000));
      const canvas = await html2canvas(receiptElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pageWidth - 40;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
      pdf.save('voting_receipt.pdf');
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 1500);
    } catch (err) {
      alert('PDF download failed: ' + err);
      console.error(err);
    } finally {
      setPdfLoading(false);
    }
  };

  // DOC Download (screenshot-based)
  const handleDownloadDOC = async () => {
    try {
      setDocLoading(true);
      setDocSuccess(false);
      console.log('DOC download clicked');
      const receiptElement = document.getElementById('receipt-area');
      if (!receiptElement) {
        alert('Receipt area not found!');
        setDocLoading(false);
        return;
      }
      // Animation delay before download
      await new Promise(res => setTimeout(res, 3000));
      const canvas = await html2canvas(receiptElement);
      const imgData = canvas.toDataURL('image/png');
      const response = await fetch(imgData);
      const imgBlob = await response.blob();
      const arrayBuffer = await imgBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(' '), // Spacer
                  // @ts-ignore: docx type issue, Uint8Array works at runtime
                  new ImageRun({
                    data: uint8Array,
                    transformation: { width: 400, height: 600 },
                  }),
                ],
              }),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'voting_receipt.docx';
      a.click();
      window.URL.revokeObjectURL(url);
      setDocSuccess(true);
      setTimeout(() => setDocSuccess(false), 1500);
    } catch (err) {
      alert('DOC download failed: ' + err);
      console.error(err);
    } finally {
      setDocLoading(false);
    }
  };

  // PNG Download
  const handleDownloadPNG = async () => {
    try {
      setPngLoading(true);
      setPngSuccess(false);
      console.log('PNG download clicked');
      const receiptElement = document.getElementById('receipt-area');
      if (!receiptElement) {
        alert('Receipt area not found!');
        setPngLoading(false);
        return;
      }
      // Animation delay before download
      await new Promise(res => setTimeout(res, 3000));
      const canvas = await html2canvas(receiptElement);
      const imgData = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imgData;
      a.download = 'voting_receipt.png';
      a.click();
      setPngSuccess(true);
      setTimeout(() => setPngSuccess(false), 1500);
    } catch (err) {
      alert('PNG download failed: ' + err);
      console.error(err);
    } finally {
      setPngLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user || !user.vid) {
    return <div className="text-red-600">You must complete voter registration to vote.</div>;
  }
  if (candidates.length === 0) {
    return <div className="text-center p-4">No candidates found for this election.</div>;
  }

  console.log('[ElectionDetails] Rendering with candidates:', candidates);

  return (
    <div className="bg-white rounded shadow p-6 mt-4 relative">
      {showSuccessPopup && (
        <>
          <ReactConfetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} recycle={false} />
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg text-xl font-bold animate-bounce">
            Vote Successful!
          </div>
        </>
      )}
      <button className="float-right text-gray-500 hover:text-black" onClick={onClose}>&times;</button>
      <h3 className="text-xl font-bold mb-2">{election.title}</h3>
      <div className="mb-4 text-sm text-gray-600">{election.type} | {election.location_region} | {election.date.slice(0, 10)}</div>
      <h4 className="font-semibold mb-2">Candidates</h4>
      <div className="flex flex-row gap-6 items-start">
        {/* Candidate Cards (left) */}
        <div className="flex flex-row gap-4 flex-1">
          {candidates.map(candidate => (
            <div
              key={candidate.cid}
              className={`w-32 h-48 bg-blue-100 rounded-lg shadow flex flex-col items-center justify-center cursor-move border-2 ${voteStatus?.voted ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'} ${voteStatus?.vote?.candidateid === candidate.cid ? 'border-green-500' : ''}`}
              draggable={!voteStatus?.voted}
              onDragStart={() => onDragStart(candidate)}
              onDragEnd={onDragEnd}
            >
              {/* Optionally show symbol_url as image */}
              {candidate.symbol_url && (
                <img src={candidate.symbol_url} alt="symbol" className="w-12 h-12 mb-2 object-contain" />
              )}
              <div className="font-bold text-center">{candidate.name}</div>
              <div className="text-xs text-gray-600 text-center mt-1">{candidate.partyname || 'Independent'}</div>
              {voteStatus?.vote?.candidateid === candidate.cid && (
                <div className="mt-2 text-green-600 font-bold">Your Vote</div>
              )}
            </div>
          ))}
        </div>
        {/* Drop Area Card (right) */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-center w-56 h-48"
          initial={false}
          animate={isOver ? { scale: 1.1, boxShadow: '0 0 32px 8px #22c55e' } : { scale: 1, boxShadow: '0 0 0 0 transparent' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div
            className={`w-full h-full flex items-center justify-center rounded-lg border-4 transition-colors duration-200 ${isOver ? 'bg-green-300 border-green-600' : 'bg-green-100 border-green-400'} ${voteStatus?.voted ? 'opacity-50' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <span className="text-lg font-semibold text-gray-700 select-none">{voteStatus?.voted ? 'Vote Registered' : 'Drop Here To Vote'}</span>
          </div>
        </motion.div>
      </div>
      {voteStatus?.voted && (
        <div className="text-green-700 font-semibold mb-2 mt-4">You have already voted in this election.</div>
      )}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {success && <div className="text-green-600 font-semibold">{success}</div>}
      {showReceipt && (
        <div id="receipt-area" className="bg-receipt-bg text-receipt-text p-6 rounded shadow max-w-md mx-auto">
          <img src={logo} alt="Logo" className="mx-auto mb-2" style={{ width: 80 }} />
          <h2 className="text-center font-bold text-xl mb-1">Election Commission of India</h2>
          <h3 className="text-center font-bold text-lg mb-4">VOTER CONFIRMATION RECEIPT</h3>
          <div className="mb-2"><b>Voter Name:</b> {user?.name}</div>
          <div className="mb-2"><b>Voter ID:</b> {user?.vid}</div>
          <div className="mb-2"><b>Constituency:</b> {election.location_region}</div>
          <div className="mb-2"><b>Election Type:</b> {election.type}</div>
          <div className="mb-2"><b>Date of Vote:</b> {new Date().toLocaleDateString()}</div>
          <div className="mb-2"><b>Voted For:</b> {votedCandidate?.name || 'Hidden'}</div>
          <div className="font-bold text-center my-3 text-lg text-receipt-success">YOU HAVE SUCCESSFULLY CAST YOUR VOTE!</div>
          <div className="mb-2 text-sm">Your vote has been securely recorded in Electronic Voting Machine (EVM).</div>
          <div className="mb-2 text-sm">
            <b>Note:</b> Your vote is your right and a powerful tool for change. Thank you for participating in strengthening Indian democracy.
          </div>
          <div className="mb-2"><b>Receipt ID:</b> {getReceiptId()}</div>
          <div className="flex justify-center my-2">
            <QRCodeCanvas value={getQRValue()} size={80} />
          </div>
          <div className="mt-2 text-xs text-gray-500">This receipt is computer-generated and requires no signature.</div>
          <div className="flex gap-4 mt-4 justify-center">
            <button onClick={handleDownloadPDF} className="bg-red-600 hover:bg-red-700 !text-white px-3 py-1 rounded shadow font-semibold min-w-[140px] flex items-center justify-center" disabled={pdfLoading}>
              {pdfLoading ? (
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : pdfSuccess ? (
                <span className="mr-2">✔️</span>
              ) : null}
              Download PDF
            </button>
            <button onClick={handleDownloadDOC} className="bg-green-600 hover:bg-green-700 !text-white px-3 py-1 rounded shadow font-semibold min-w-[140px] flex items-center justify-center" disabled={docLoading}>
              {docLoading ? (
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : docSuccess ? (
                <span className="mr-2">✔️</span>
              ) : null}
              Download DOC
            </button>
            <button onClick={handleDownloadPNG} className="bg-yellow-500 hover:bg-yellow-600 !text-white px-3 py-1 rounded shadow font-semibold min-w-[140px] flex items-center justify-center" disabled={pngLoading}>
              {pngLoading ? (
                <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : pngSuccess ? (
                <span className="mr-2">✔️</span>
              ) : null}
              Download PNG
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">(You can download your receipt in any format above.)</div>
        </div>
      )}
    </div>
  );
};

export default ElectionDetails; 