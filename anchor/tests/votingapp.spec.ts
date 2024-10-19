import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { Votingapp } from '../target/types/votingapp'; 
import { BankrunProvider, startAnchor } from 'anchor-bankrun';
import IDL from "../target/idl/votingapp.json"; 
const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('votingapp', () => {
  it('Initialize Votingapp', async () => {
    const context = await startAnchor("", [{ name: "votingapp", programId: votingAddress }], []);

    const provider = new BankrunProvider(context);
    const votingProgram = new Program<Votingapp>(
      IDL as unknown as Votingapp, 
      provider
    );


    await votingProgram.methods.initializePoll(
      new anchor.BN(1), 
      "What is your favourite type of sos",
      new anchor.BN(0), 
      new anchor.BN(1929306737)
    ).rpc();

    const [pollAddress]=PublicKey.findProgramAddressSync([new anchor.BN(1).toArrayLike(Buffer,"le",8)],votingAddress);

    const poll=await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favourite type of sos")
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())
  });

});
