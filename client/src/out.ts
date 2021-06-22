// @ts-nocheck

export const consensus = {
'commit' : `commit();

A *commit statement*, written commit();, commits to statement’s
continuation as the next step of the DApp computation. In other words,
it ends the current consensus step and allows more local steps.

`,

'only' : `\`only\` and \`each\` are allowed in consensus steps and are executed by
backends once they observe the completion of the consensus step (i.e.,
after the associated commit statement.)

`,

'each' : `\`only\` and \`each\` are allowed in consensus steps and are executed by
backends once they observe the completion of the consensus step (i.e.,
after the associated commit statement.)

`,

'Participant.set' : `Participant.set(PART, ADDR); PART.set(ADDR);

After execution, the given participant is fixed to the given address. It
is invalid to attempt to .set a participant class. If a backend is
running for this participant and its address does not match the given
address, then it will abort. This may only occur within a consensus
step.

> \[missing\] is a good introductory project that demonstrates how to use
> this feature of Reach.

`,

'while' : `var \[ heap1, heap2 \] = \[ 21, 21 \]; { const sum = () =\> heap1 +
heap2; } invariant(balance() == 2 \* wagerAmount); while ( sum() \>
0 ) {   ....   \[ heap1, heap2 \] = \[ heap1 - 1, heap2 \];   continue;
}

A *while statement* may occur within a consensus step and is written:

var LHS = INIT\_EXPR; BLOCK; // optional invariant(INVARIANT\_EXPR);
while( COND\_EXPR ) BLOCK

where LHS is a valid left-hand side of an identifier definition where
the expression INIT\_EXPR is the right-hand side, and BLOCK is an
optional block that may define bindings that use the LHS values which
are bound inside the rest of the while and its tail, and INVARIANT\_EXPR
is an expression, called the *loop invariant*, that must be true before
and after every execution of the block BLOCK, and if COND\_EXPR is true,
then the block executes, and if not, then the loop terminates and
control transfers to the continuation of the while statement. The
identifiers bound by LHS are bound within INVARIANT\_EXPR, COND\_EXPR,
BLOCK, and the tail of the while statement.

> Read about finding loop invariants in the Reach guide.

`,

'continue' : `\[ heap1, heap2 \] = \[ heap1 - 1, heap2 \]; continue;

A *continue statement* may occur within a while statement’s block and is
written:

LHS = UPDATE\_EXPR; continue;

where the identifiers bound by LHS are a subset of the variables bound
by the nearest enclosing while statement and UPDATE\_EXPR is an
expression which may be bound by LHS.

A continue statement is a terminator statement, so it must have an empty
tail.

A continue statement may be written without the preceding identifier
update, which is equivalent to writing

\[\] = \[\]; continue;

A continue statement must be dominated by a consensus transfer, which
means that the body of a while statement must always commit(); before
calling continue;. This restriction may be lifted in future versions of
Reach, which will perform termination checking.

`,

'parallelReduce' : `const \[ keepGoing, as, bs \] =   parallelReduce(\[ true, 0, 0 \])
.invariant(balance() == 2 \* wager)   .while(keepGoing)
.case(Alice, (() =\> ({     when:
declassify(interact.keepGoing()) })),     (\_) =\> {
each(\[Alice, Bob\], () =\> {         interact.roundWinnerWas(true);
});       return \[ true, 1 + as, bs \]; })   .case(Bob, (() =\> ({
when: declassify(interact.keepGoing()) })),     (\_) =\> {
each(\[Alice, Bob\], () =\> {         interact.roundWinnerWas(false);
});       return \[ true, as, 1 + bs \]; })   .timeout(deadline, ()
\=\> {     showOutcome(TIMEOUT)();     race(Alice, Bob).publish();
return \[ false, as, bs \]; });

A *parallel reduce statement* is written:

const LHS =   parallelReduce(INIT\_EXPR)   .invariant(INVARIANT\_EXPR)
.while(COND\_EXPR)   .paySpec(TOKENS\_EXPR)   .case(PART\_EXPR,
PUBLISH\_EXPR,     PAY\_EXPR,     CONSENSUS\_EXPR)
.timeout(DELAY\_EXPR, () =\>     TIMEOUT\_BLOCK);

The LHS and INIT\_EXPR are like the initialization component of a while
loop; and, the .invariant and .while components are like the invariant
and condition of a while loop; while the .case, .timeout, and .paySpec
components are like the corresponding components of a fork statement.

The .case component may be repeated many times, provided the PART\_EXPRs
each evaluate to a unique participant, just like in a fork statement.

`,

'this' : `Inside of a consensus step, this refers to the address of the
participant that performed the consensus transfer. This is useful when
the consensus transfer was initiated by a race expression.

`,

'transfer' : `transfer(10).to(Alice); transfer(2, gil).to(Alice);

A *transfer expression*, written
transfer(AMOUNT\_EXPR).to(ADDR\_EXPR), where AMOUNT\_EXPR is an
expression that evaluates to an unsigned integer, and ADDR\_EXPR
evaluates to an address, performs a transfer of network tokens from the
contract to the named participant. AMOUNT\_EXPR must evaluate to less
than or equal to the balance of network tokens in the contract account.

A transfer expression may also be written transfer(AMOUNT\_EXPR,
TOKEN\_EXPR).to(ADDR\_EXPR), where TOKEN\_EXPR is a Token, which
transfers non-network tokens of the specified type.

A transfer expression may only occur within a consensus step.

`,

'require' : `require( claim, \[msg\] )

A requirement where claim evaluates to true with honest participants.
This may only appear in a consensus step. It accepts an optional bytes
argument, which is included in any reported violation.

`,

'checkCommitment' : `checkCommitment( commitment, salt, x )

Makes a requirement that commitment is the digest of salt and x. This is
used in a consensus step after makeCommitment was used in a local step.

`,

};
export const step = {
'only' : `Alice.only(() =\> {   const pretzel = interact.random(); });

A local step statement is written PART.only(() =\> BLOCK), where PART
is a participant identifier and BLOCK is a block. Within BLOCK, PART is
bound to the address of the participant. Any bindings defined within the
block of a local step are available in the statement’s tail as new local
state. For example,

Alice.only(() =\> {   const x = 3; }); Alice.only(() =\> {   const y
\= x + 1; });

is a valid program where Alice’s local state includes the private values
x (bound to 3) and y (bound to 4). However, such bindings are ​\_not\_​
consensus state, so they are purely local state. For example,

Alice.only(() =\> {   const x = 3; }); Bob.only(() =\> {   const y =
x + 1; });

is an invalid program, because Bob does not know x.

The *interact shorthand*, written PART.interact.METHOD(EXPR\_0, ...,
EXPR\_n), is available for calling an interact function from outside of
an only block. Such functions must return Null; therefore, they are only
useful if they produce side-effects, such as logging on the frontend.
For example, the function log in the participant interact interface of
Alice may be called via:

Alice.interact.log(x);

**—**

each(\[Alice, Bob\], () =\> {   const pretzel = interact.random();
});

An *each* local step statement can be written as each(PART\_TUPLE ()
\=\> BLOCK), where PART\_TUPLE is a tuple of participants and BLOCK is a
block. It is an abbreviation of many local step statements that could
have been written with only.

`,

'each' : `Alice.only(() =\> {   const pretzel = interact.random(); });

A local step statement is written PART.only(() =\> BLOCK), where PART
is a participant identifier and BLOCK is a block. Within BLOCK, PART is
bound to the address of the participant. Any bindings defined within the
block of a local step are available in the statement’s tail as new local
state. For example,

Alice.only(() =\> {   const x = 3; }); Alice.only(() =\> {   const y
\= x + 1; });

is a valid program where Alice’s local state includes the private values
x (bound to 3) and y (bound to 4). However, such bindings are ​\_not\_​
consensus state, so they are purely local state. For example,

Alice.only(() =\> {   const x = 3; }); Bob.only(() =\> {   const y =
x + 1; });

is an invalid program, because Bob does not know x.

The *interact shorthand*, written PART.interact.METHOD(EXPR\_0, ...,
EXPR\_n), is available for calling an interact function from outside of
an only block. Such functions must return Null; therefore, they are only
useful if they produce side-effects, such as logging on the frontend.
For example, the function log in the participant interact interface of
Alice may be called via:

Alice.interact.log(x);

**—**

each(\[Alice, Bob\], () =\> {   const pretzel = interact.random();
});

An *each* local step statement can be written as each(PART\_TUPLE ()
\=\> BLOCK), where PART\_TUPLE is a tuple of participants and BLOCK is a
block. It is an abbreviation of many local step statements that could
have been written with only.

`,

'publish' : `Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(DELAY, () =\> {        Bob.publish();        commit();
return false; });   Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(DELAY, () =\> closeTo(Bob, false));
Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(false);

A consensus transfer is written PART\_EXPR.publish(ID\_0, ...,
ID\_n).pay(PAY\_EXPR)..when(WHEN\_EXPR).timeout(DELAY\_EXPR, () =\>
TIMEOUT\_BLOCK), where PART\_EXPR is an expression that evaluates to a
participant or race expression, ID\_0 through ID\_n are identifiers for
PART’s public local state, PAY\_EXPR is a public expression evaluating
to a pay amount, WHEN\_EXPR is a public expression evaluating to a
boolean and determines if the consensus transfer takes place,
DELAY\_EXPR is a public expression that depends on only consensus state
and evaluates to a time delta represented by a natural number,
TIMEOUT\_BLOCK is a timeout block, which will be executed after
DELAY\_EXPR units of time have passed from the end of the last consensus
step without PART executing this consensus transfer. All of the
expressions within a consensus transfer are evaluated in a *pure*
context, which may not alter the state of the application.

The continuation of a consensus transfer statement is a consensus step,
which is finalized with a commit statement. The continuation of a
timeout block is the same as the continuation of the function the
timeout occurs within.

> See the guide section on non-participation to understand when to use
> timeouts and how to use them most effectively.

The publish component exclusive-or the pay component may be omitted, if
either there is no publication or no transfer of network tokens to
accompany this consensus transfer. The when component may always be
omitted, in which case it is assumed to be true. publish or pay must
occur first, after which components may occur in any order. For example,
the following are all valid:

Alice.publish(coinFlip);  Alice.pay(penaltyAmount);
Alice.pay(penaltyAmount).publish(coinFlip);  Alice.publish(coinFlip)
.timeout(DELAY, () =\> closeTo(Bob, () =\> exit()));
Alice.pay(penaltyAmount)      .timeout(DELAY, () =\> {
Bob.publish();        commit();        exit(); });
Alice.publish(bid).when(wantsToBid);

The timeout component must be included if when is not statically true.
This ensures that your clients will eventually complete the program. If
a consensus transfer is a guaranteed race between non-class participants
and a participant class that ​\_may\_​ attempt to transfer (i.e. when is
not statically false), then a timeout may be explicitly omitted by
writing .timeout(false).

.throwTimeout may be used in place of .timeout. It accepts a DELAY\_EXPR
and an EXPR, which will be thrown if a timeout should occur. If an EXPR
is not provided, then null will be thrown. If a consensus transfer uses
.throwTimeout, it must be within a try statement.

If a consensus transfer specifies a single participant, which has not
yet been fixed in the application and is not a participant class, then
this statement does so; therefore, after it the PART may be used as an
address.

If a consensus transfer specificies a single participant class, then all
members of that class will attempt to perform the transfer, but only one
will succeed.

A consensus transfer binds the identifiers ID\_0 through ID\_n for all
participants to the values included in the consensus transfer. If an
existing participant, not included in PART\_EXPR, has previously bound
one of these identifiers, then the program is not valid. In other words,
the following program is not valid:

Alice.only(() =\> {  const x = 1; }); Bob.only(() =\> {  const x =
2; }); Claire.only(() =\> {  const x = 3; }); race(Alice,
Bob).publish(x); commit();

because Claire is not included in the race. However, if we were to
rename Claire’s x into y, then it would be valid, because although Alice
and Bob both bind x, they participate in the race, so it is allowed. In
the tail of this program, x is bound to either 1 or 2.

`,

'pay' : `Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(DELAY, () =\> {        Bob.publish();        commit();
return false; });   Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(DELAY, () =\> closeTo(Bob, false));
Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(false);

A consensus transfer is written PART\_EXPR.publish(ID\_0, ...,
ID\_n).pay(PAY\_EXPR)..when(WHEN\_EXPR).timeout(DELAY\_EXPR, () =\>
TIMEOUT\_BLOCK), where PART\_EXPR is an expression that evaluates to a
participant or race expression, ID\_0 through ID\_n are identifiers for
PART’s public local state, PAY\_EXPR is a public expression evaluating
to a pay amount, WHEN\_EXPR is a public expression evaluating to a
boolean and determines if the consensus transfer takes place,
DELAY\_EXPR is a public expression that depends on only consensus state
and evaluates to a time delta represented by a natural number,
TIMEOUT\_BLOCK is a timeout block, which will be executed after
DELAY\_EXPR units of time have passed from the end of the last consensus
step without PART executing this consensus transfer. All of the
expressions within a consensus transfer are evaluated in a *pure*
context, which may not alter the state of the application.

The continuation of a consensus transfer statement is a consensus step,
which is finalized with a commit statement. The continuation of a
timeout block is the same as the continuation of the function the
timeout occurs within.

> See the guide section on non-participation to understand when to use
> timeouts and how to use them most effectively.

The publish component exclusive-or the pay component may be omitted, if
either there is no publication or no transfer of network tokens to
accompany this consensus transfer. The when component may always be
omitted, in which case it is assumed to be true. publish or pay must
occur first, after which components may occur in any order. For example,
the following are all valid:

Alice.publish(coinFlip);  Alice.pay(penaltyAmount);
Alice.pay(penaltyAmount).publish(coinFlip);  Alice.publish(coinFlip)
.timeout(DELAY, () =\> closeTo(Bob, () =\> exit()));
Alice.pay(penaltyAmount)      .timeout(DELAY, () =\> {
Bob.publish();        commit();        exit(); });
Alice.publish(bid).when(wantsToBid);

The timeout component must be included if when is not statically true.
This ensures that your clients will eventually complete the program. If
a consensus transfer is a guaranteed race between non-class participants
and a participant class that ​\_may\_​ attempt to transfer (i.e. when is
not statically false), then a timeout may be explicitly omitted by
writing .timeout(false).

.throwTimeout may be used in place of .timeout. It accepts a DELAY\_EXPR
and an EXPR, which will be thrown if a timeout should occur. If an EXPR
is not provided, then null will be thrown. If a consensus transfer uses
.throwTimeout, it must be within a try statement.

If a consensus transfer specifies a single participant, which has not
yet been fixed in the application and is not a participant class, then
this statement does so; therefore, after it the PART may be used as an
address.

If a consensus transfer specificies a single participant class, then all
members of that class will attempt to perform the transfer, but only one
will succeed.

A consensus transfer binds the identifiers ID\_0 through ID\_n for all
participants to the values included in the consensus transfer. If an
existing participant, not included in PART\_EXPR, has previously bound
one of these identifiers, then the program is not valid. In other words,
the following program is not valid:

Alice.only(() =\> {  const x = 1; }); Bob.only(() =\> {  const x =
2; }); Claire.only(() =\> {  const x = 3; }); race(Alice,
Bob).publish(x); commit();

because Claire is not included in the race. However, if we were to
rename Claire’s x into y, then it would be valid, because although Alice
and Bob both bind x, they participate in the race, so it is allowed. In
the tail of this program, x is bound to either 1 or 2.

`,

'when' : `Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(DELAY, () =\> {        Bob.publish();        commit();
return false; });   Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(DELAY, () =\> closeTo(Bob, false));
Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(false);

A consensus transfer is written PART\_EXPR.publish(ID\_0, ...,
ID\_n).pay(PAY\_EXPR)..when(WHEN\_EXPR).timeout(DELAY\_EXPR, () =\>
TIMEOUT\_BLOCK), where PART\_EXPR is an expression that evaluates to a
participant or race expression, ID\_0 through ID\_n are identifiers for
PART’s public local state, PAY\_EXPR is a public expression evaluating
to a pay amount, WHEN\_EXPR is a public expression evaluating to a
boolean and determines if the consensus transfer takes place,
DELAY\_EXPR is a public expression that depends on only consensus state
and evaluates to a time delta represented by a natural number,
TIMEOUT\_BLOCK is a timeout block, which will be executed after
DELAY\_EXPR units of time have passed from the end of the last consensus
step without PART executing this consensus transfer. All of the
expressions within a consensus transfer are evaluated in a *pure*
context, which may not alter the state of the application.

The continuation of a consensus transfer statement is a consensus step,
which is finalized with a commit statement. The continuation of a
timeout block is the same as the continuation of the function the
timeout occurs within.

> See the guide section on non-participation to understand when to use
> timeouts and how to use them most effectively.

The publish component exclusive-or the pay component may be omitted, if
either there is no publication or no transfer of network tokens to
accompany this consensus transfer. The when component may always be
omitted, in which case it is assumed to be true. publish or pay must
occur first, after which components may occur in any order. For example,
the following are all valid:

Alice.publish(coinFlip);  Alice.pay(penaltyAmount);
Alice.pay(penaltyAmount).publish(coinFlip);  Alice.publish(coinFlip)
.timeout(DELAY, () =\> closeTo(Bob, () =\> exit()));
Alice.pay(penaltyAmount)      .timeout(DELAY, () =\> {
Bob.publish();        commit();        exit(); });
Alice.publish(bid).when(wantsToBid);

The timeout component must be included if when is not statically true.
This ensures that your clients will eventually complete the program. If
a consensus transfer is a guaranteed race between non-class participants
and a participant class that ​\_may\_​ attempt to transfer (i.e. when is
not statically false), then a timeout may be explicitly omitted by
writing .timeout(false).

.throwTimeout may be used in place of .timeout. It accepts a DELAY\_EXPR
and an EXPR, which will be thrown if a timeout should occur. If an EXPR
is not provided, then null will be thrown. If a consensus transfer uses
.throwTimeout, it must be within a try statement.

If a consensus transfer specifies a single participant, which has not
yet been fixed in the application and is not a participant class, then
this statement does so; therefore, after it the PART may be used as an
address.

If a consensus transfer specificies a single participant class, then all
members of that class will attempt to perform the transfer, but only one
will succeed.

A consensus transfer binds the identifiers ID\_0 through ID\_n for all
participants to the values included in the consensus transfer. If an
existing participant, not included in PART\_EXPR, has previously bound
one of these identifiers, then the program is not valid. In other words,
the following program is not valid:

Alice.only(() =\> {  const x = 1; }); Bob.only(() =\> {  const x =
2; }); Claire.only(() =\> {  const x = 3; }); race(Alice,
Bob).publish(x); commit();

because Claire is not included in the race. However, if we were to
rename Claire’s x into y, then it would be valid, because although Alice
and Bob both bind x, they participate in the race, so it is allowed. In
the tail of this program, x is bound to either 1 or 2.

`,

'timeout' : `Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(DELAY, () =\> {        Bob.publish();        commit();
return false; });   Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(DELAY, () =\> closeTo(Bob, false));
Alice.publish(wagerAmount)      .pay(wagerAmount)
.timeout(false);

A consensus transfer is written PART\_EXPR.publish(ID\_0, ...,
ID\_n).pay(PAY\_EXPR)..when(WHEN\_EXPR).timeout(DELAY\_EXPR, () =\>
TIMEOUT\_BLOCK), where PART\_EXPR is an expression that evaluates to a
participant or race expression, ID\_0 through ID\_n are identifiers for
PART’s public local state, PAY\_EXPR is a public expression evaluating
to a pay amount, WHEN\_EXPR is a public expression evaluating to a
boolean and determines if the consensus transfer takes place,
DELAY\_EXPR is a public expression that depends on only consensus state
and evaluates to a time delta represented by a natural number,
TIMEOUT\_BLOCK is a timeout block, which will be executed after
DELAY\_EXPR units of time have passed from the end of the last consensus
step without PART executing this consensus transfer. All of the
expressions within a consensus transfer are evaluated in a *pure*
context, which may not alter the state of the application.

The continuation of a consensus transfer statement is a consensus step,
which is finalized with a commit statement. The continuation of a
timeout block is the same as the continuation of the function the
timeout occurs within.

> See the guide section on non-participation to understand when to use
> timeouts and how to use them most effectively.

The publish component exclusive-or the pay component may be omitted, if
either there is no publication or no transfer of network tokens to
accompany this consensus transfer. The when component may always be
omitted, in which case it is assumed to be true. publish or pay must
occur first, after which components may occur in any order. For example,
the following are all valid:

Alice.publish(coinFlip);  Alice.pay(penaltyAmount);
Alice.pay(penaltyAmount).publish(coinFlip);  Alice.publish(coinFlip)
.timeout(DELAY, () =\> closeTo(Bob, () =\> exit()));
Alice.pay(penaltyAmount)      .timeout(DELAY, () =\> {
Bob.publish();        commit();        exit(); });
Alice.publish(bid).when(wantsToBid);

The timeout component must be included if when is not statically true.
This ensures that your clients will eventually complete the program. If
a consensus transfer is a guaranteed race between non-class participants
and a participant class that ​\_may\_​ attempt to transfer (i.e. when is
not statically false), then a timeout may be explicitly omitted by
writing .timeout(false).

.throwTimeout may be used in place of .timeout. It accepts a DELAY\_EXPR
and an EXPR, which will be thrown if a timeout should occur. If an EXPR
is not provided, then null will be thrown. If a consensus transfer uses
.throwTimeout, it must be within a try statement.

If a consensus transfer specifies a single participant, which has not
yet been fixed in the application and is not a participant class, then
this statement does so; therefore, after it the PART may be used as an
address.

If a consensus transfer specificies a single participant class, then all
members of that class will attempt to perform the transfer, but only one
will succeed.

A consensus transfer binds the identifiers ID\_0 through ID\_n for all
participants to the values included in the consensus transfer. If an
existing participant, not included in PART\_EXPR, has previously bound
one of these identifiers, then the program is not valid. In other words,
the following program is not valid:

Alice.only(() =\> {  const x = 1; }); Bob.only(() =\> {  const x =
2; }); Claire.only(() =\> {  const x = 3; }); race(Alice,
Bob).publish(x); commit();

because Claire is not included in the race. However, if we were to
rename Claire’s x into y, then it would be valid, because although Alice
and Bob both bind x, they participate in the race, so it is allowed. In
the tail of this program, x is bound to either 1 or 2.

`,

'fork' : `fork() .case(Alice, (() =\> ({   msg: 19,   when:
declassify(interact.keepGoing()) })),   ((v) =\> v),   (v) =\> {
require(v == 19);     transfer(wager + 19).to(this);     commit();
exit();   }) .case(Bob, (() =\> ({   when:
declassify(interact.keepGoing()) })),   ((\_) =\> wager),   (\_)
\=\> {     commit();      Alice.only(() =\>
interact.showOpponent(Bob));      race(Alice, Bob).publish();
transfer(2 \* wager).to(this);     commit();     exit();   })
.timeout(deadline, () =\> {   race(Alice, Bob).publish();
transfer(wager).to(this);   commit();   exit(); });

A *fork statement* is written:

fork() .paySpec(TOKENS\_EXPR) .case(PART\_EXPR,   PUBLISH\_EXPR,
PAY\_EXPR,   CONSENSUS\_EXPR) .timeout(DELAY\_EXPR, () =\>
TIMEOUT\_BLOCK);

where: TOKENS\_EXPR is an expression that evalues to a tuple of Tokens.
PART\_EXPR is an expression that evaluates to a participant;
PUBLISH\_EXPR is a syntactic arrow expression that is evaluated in a
local step for the specified participant and must evaluate to an object
that may contain a \`msg\` field, which may be of any type, and a \`when\`
field, which must be a boolean; PAY\_EXPR is an expression that
evaluates to a function parameterized over the \`msg\` value and returns a
pay amount; CONSENSUS\_EXPR is a syntactic arrow expression
parameterized over the \`msg\` value which is evaluated in a consensus
step; and, the timeout and throwTimeout parameter are as in an consensus
transfer.

If the \`msg\` field is absent from the object returned from
PUBLISH\_EXPR, then it is treated as if it were null.

If the \`when\` field is absent from the object returned from
PUBLISH\_EXPR, then it is treated as if it were true.

If the PAY\_EXPR is absent, then it is treated as if it were (\_) =\> 0.

The .case component may be repeated many times.

The same participant may specify multiple cases. In this situation, the
order of the cases is significant. That is, a subsequent case will only
be evaluated if the prior case’s \`when\` field is false.

If the participant specified by PART\_EXPR is not already fixed (in the
sense of Participant.set), then if it wins the race, it is fixed,
provided it is not a participant class.

**—**

A fork statement is an abbreviation of a common race and switch pattern
you could write yourself.

The idea is that each of the participants in the case components do an
independent local step evaluation of a value they would like to publish
and then all race to publish it. The one that "wins" the race then
determines not only the value (& pay amount), but also what consensus
step code runs to consume the value.

The sample fork statement linked to the fork keyword is roughly
equivalent to: // We first define a Data instance so that each
participant can publish a // different kind of value const ForkData =
Data({Alice: UInt, Bob: Null}); // Then we bind these values for each
participant Alice.only(() =\> {  const fork\_msg =
ForkData.Alice(19);  const fork\_when =
declassify(interact.keepGoing()); }); Bob.only(() =\> {  const
fork\_msg = ForkData.Bob(null);  const fork\_when =
declassify(interact.keepGoing()); }); // They race race(Alice, Bob)
.publish(fork\_msg)  .when(fork\_when)  // The pay ammount depends on
who is publishing  .pay(fork\_msg.match( {    Alice: (v =\> v),
Bob: ((\_) =\> wager) } ))  // The timeout is always the same
.timeout(deadline, () =\> {    race(Alice, Bob).publish();
transfer(wager).to(this);    commit();    exit(); });   // We
ensure that the correct participant published the correct kind of value
require(fork\_msg.match( {    // Alice had previously published
Alice: (v =\> this == Alice),    // But Bob had not.    Bob: ((\_) =\>
true) } ));   // Then we select the appropriate body to run  switch
(fork\_msg) {    case Alice: {      assert (this == Alice);
require(v == 19);      transfer(wager + 19).to(this);
commit();      exit(); }    case Bob: {      Bob.set(this);
commit();       Alice.only(() =\> interact.showOpponent(Bob));
race(Alice, Bob).publish();      transfer(2 \* wager).to(this);
commit();      exit(); }  }

This pattern is tedious to write and error-prone, so the fork statement
abbreviates it for Reach programmers. When a participant specifies
multiple cases, the \`msg\` field of the participant will be wrapped with
an additional variant signifying what case was chosen.

`,

'wait' : `wait(AMOUNT);

A *wait statement*, written wait(AMOUNT);, delays the computation until
AMOUNT time delta units have passed. AMOUNT must be pure and only
reference values known by the consensus state. It may only occur in a
step.

`,

'exit' : `exit();

An *exit statement*, written exit();, halts the computation. It is a
terminator statement, so it must have an empty tail. It may only occur
in a step.

`,

'race' : `race(Alice, Bob).publish(bet);

A *race expression*, written race(PARTICIPANT\_0, ...,
PARTICIPANT\_n);, constructs a participant that may be used in a
consensus transfer statement, such as publish or pay, where the various
participants race to be the first one to perform the consensus transfer.

Reach provides a shorthand, Anybody, which serves as a race between all
the participants.

> See the guide section on races to understand the benefits and dangers of
> using race.

`,

'unknowable' : `unknowable( Notter, Knower(var\_0, ..., var\_N), \[msg\] )

A knowledge assertion that the participant Notter ​\_does not\_​ know the
results of the variables var\_0 through var\_N, but that the participant
Knower ​\_does\_​ know those values. It accepts an optional bytes
argument, which is included in any reported violation.

`,

'closeTo' : `closeTo( Who, after, nonNetPayAmt )

Has participant Who make a publication, then transfer the balance()
and the non-network pay amount to Who and end the DApp after executing
the function after in a step. The nonNetPayAmt parameter should be a pay
amount. For example, when closing a program that uses a Token token, the
argument would be \[ \[balance(tok), tok\] \]. The after and
nonNetPayAmt argument are optional.

`,

};
export const compute = {
'const' : `An *identifier definition* is either a value definition or a function
definition. Each of these introduces one or more \_bound identifier\_s.

**—**

const DELAY = 10; const \[ Good, Bad \] = \[ 42, 43 \]; const { x, y } =
{ x: 1, y: 2 }; const \[ x, \[ y \] \] = \[ 1, \[ 2 \] \]; const \[ x, {
y } \] = \[ 1, { y: 2 } \]; const { x: \[ a, b \] } = { x: \[ 1, 2 \] };

> Valid *identifiers* follow the same rules as JavaScript identifiers:
> they may consist of Unicode alphanumeric characters, or \_ or $, but may
> not begin with a digit.

A *value definition* is written const LHS = RHS;.

LHS must obey the grammar:

\<*LHS*\>          \`::=\`\<*id*\>  
\`   |  \`\`[ \` \<*LHS-tuple-seq*\> \`]\`  
\`   |  \`\`{ \` \<*LHS-obj-seq*\> \`}\`  
\<*LHS-tuple-seq*\>\`::=\`  
\`   |  \`\`... \` \<*LHS*\>  
\`  |  \`\<*LHS*\>  
\`  |  \`\<*LHS*\> \`,\` \<*LHS-tuple-seq*\>  
\<*LHS-obj-seq*\>  \`::=\`  
\`   |  \`\`... \` \<*LHS*\>  
\`  |  \`\<*LHS-obj-elem*\>  
\`  |  \`\<*LHS-obj-elem*\> \`,\` \<*LHS-obj-seq*\>
\<*LHS-obj-elem*\> \`::=\`\<*id*\>  
\`  |  \`\<*propertyName*\> \`:\` \<*LHS*\>  
\<*propertyName*\> \`::=\`\<*id*\>  
\`  |  \`\<*string*\>  
\`  |  \`\<*number*\>  
\`   |  \`\`[ \` \<*expr*\> \`]\`

RHS must be compatible with the given LHS. That is, if a LHS is an
\<*LHS-tuple-seq*\>, then the corresponding RHS must be a tuple with the
correct number of elements. If a LHS is an \<*LHS-obj-seq*\>, then the
corresponding RHS must be an object with the correct fields.

Those values are available as their corresponding bound identifiers in
the statement’s tail.

**—**

function randomBool() {   return (interact.random() % 2) == 0; };

A *function definition*, written function FUN(LHS\_0, ..., LHS\_n)
BLOCK;, defines FUN as a function which abstracts its *function body*,
the block BLOCK, over the left-hand sides LHS\_0 through LHS\_n.

Function parameters may specify default arguments. The expressions used
to instantiate these parameters have access to any variables in the
scope of which the function was defined. Additionally, these expressions
may reference previous arguments of the function definition. Parameters
with default arguments must come after all other parameters.

function f(a, b, c = a + 1, d = b + c) =\>   a + b + c + d;

The last parameter of a function may be a *rest parameter*, which allows
the function to be called with an arbitrary number of arguments. A rest
parameter is specified via ...IDENT, where IDENT is bound to a Tuple
containing all the remaining arguments.

**—**

All identifiers in Reach programs must be *unbound* at the position of
the program where they are bound, i.e., it is invalid to shadow
identifiers with new definitions. For example,

const x = 3; const x = 4;

is invalid. This restriction is independent of whether a binding is only
known to a single participant. For example,

Alice.only(() =\> {   const x = 3; }); Bob.only(() =\> {   const x =
3; });

is invalid.

The special identifier \_ is an exception to this rule. The \_ binding
is always considered to be unbound. This means means that \_ is both an
identifier that can never be read, as well as an identifier that may be
bound many times. This may be useful for ignoring unwanted values, for
example:

const \[\_, x, \_\] = \[1, 2, 3\];

`,

'function' : `An *identifier definition* is either a value definition or a function
definition. Each of these introduces one or more \_bound identifier\_s.

**—**

const DELAY = 10; const \[ Good, Bad \] = \[ 42, 43 \]; const { x, y } =
{ x: 1, y: 2 }; const \[ x, \[ y \] \] = \[ 1, \[ 2 \] \]; const \[ x, {
y } \] = \[ 1, { y: 2 } \]; const { x: \[ a, b \] } = { x: \[ 1, 2 \] };

> Valid *identifiers* follow the same rules as JavaScript identifiers:
> they may consist of Unicode alphanumeric characters, or \_ or $, but may
> not begin with a digit.

A *value definition* is written const LHS = RHS;.

LHS must obey the grammar:

\<*LHS*\>          \`::=\`\<*id*\>  
\`   |  \`\`[ \` \<*LHS-tuple-seq*\> \`]\`  
\`   |  \`\`{ \` \<*LHS-obj-seq*\> \`}\`  
\<*LHS-tuple-seq*\>\`::=\`  
\`   |  \`\`... \` \<*LHS*\>  
\`  |  \`\<*LHS*\>  
\`  |  \`\<*LHS*\> \`,\` \<*LHS-tuple-seq*\>  
\<*LHS-obj-seq*\>  \`::=\`  
\`   |  \`\`... \` \<*LHS*\>  
\`  |  \`\<*LHS-obj-elem*\>  
\`  |  \`\<*LHS-obj-elem*\> \`,\` \<*LHS-obj-seq*\>
\<*LHS-obj-elem*\> \`::=\`\<*id*\>  
\`  |  \`\<*propertyName*\> \`:\` \<*LHS*\>  
\<*propertyName*\> \`::=\`\<*id*\>  
\`  |  \`\<*string*\>  
\`  |  \`\<*number*\>  
\`   |  \`\`[ \` \<*expr*\> \`]\`

RHS must be compatible with the given LHS. That is, if a LHS is an
\<*LHS-tuple-seq*\>, then the corresponding RHS must be a tuple with the
correct number of elements. If a LHS is an \<*LHS-obj-seq*\>, then the
corresponding RHS must be an object with the correct fields.

Those values are available as their corresponding bound identifiers in
the statement’s tail.

**—**

function randomBool() {   return (interact.random() % 2) == 0; };

A *function definition*, written function FUN(LHS\_0, ..., LHS\_n)
BLOCK;, defines FUN as a function which abstracts its *function body*,
the block BLOCK, over the left-hand sides LHS\_0 through LHS\_n.

Function parameters may specify default arguments. The expressions used
to instantiate these parameters have access to any variables in the
scope of which the function was defined. Additionally, these expressions
may reference previous arguments of the function definition. Parameters
with default arguments must come after all other parameters.

function f(a, b, c = a + 1, d = b + c) =\>   a + b + c + d;

The last parameter of a function may be a *rest parameter*, which allows
the function to be called with an arbitrary number of arguments. A rest
parameter is specified via ...IDENT, where IDENT is bound to a Tuple
containing all the remaining arguments.

**—**

All identifiers in Reach programs must be *unbound* at the position of
the program where they are bound, i.e., it is invalid to shadow
identifiers with new definitions. For example,

const x = 3; const x = 4;

is invalid. This restriction is independent of whether a binding is only
known to a single participant. For example,

Alice.only(() =\> {   const x = 3; }); Bob.only(() =\> {   const x =
3; });

is invalid.

The special identifier \_ is an exception to this rule. The \_ binding
is always considered to be unbound. This means means that \_ is both an
identifier that can never be read, as well as an identifier that may be
bound many times. This may be useful for ignoring unwanted values, for
example:

const \[\_, x, \_\] = \[1, 2, 3\];

`,

'return' : `return 17; return 3 + 4; return f(2, false); return;

A *return statement*, written return EXPR;, where EXPR is an expression
evaluates to the same value as EXPR. As a special case, return; is
interpreted the same as return null;.

A return statement returns its value to the surrounding function
application.

A return statement is a terminator statement, so it must have an empty
tail. For example,

{ return 1;   return 2; }

is invalid, because the first return’s tail is not empty.

`,

'if' : `if ( 1 + 2 \< 3 ) {   return "Yes\!"; } else {   return "No, waaah\!"; }

A *conditional statement*, written if (COND) NOT\_FALSE else FALSE,
where COND is an expression and NOT\_FALSE and FALSE as statements
(potentially block statements), selects between the NOT\_FALSE
statement and FALSE statement based on whether COND evaluates to false.

Both NOT\_FALSE and FALSE have empty tails, i.e. the tail of the
conditional statement is not propagated. For example,

if ( x \< y ) {   const z = 3; } else {   const z = 4; } return z;

is erroneous, because the identifier z is not bound outside the
conditional statement.

A conditional statement may only include a consensus transfer in
NOT\_FALSE or FALSE if it is within a consensus step, because its
statements are in the same context as the conditional statement itself.

`,

'switch' : `const mi = Maybe(UInt).Some(42); switch ( mi ) {  case None: return
8;  case Some: return mi + 10; } switch ( mi ) {  case None: return 8;
default: return 41; }

A *switch statement*, written switch (VAR) { CASE ... }, where VAR is a
variable bound to a data instance and CASE is either case VARIANT: STMT
..., where VARIANT is a variant, or default: STMT ..., STMT is a
sequence of statements, selects the appropriate sequence of statements
based on which variant VAR holds. Within the body of a switch case, VAR
has the type of variant; i.e. in a Some case of a Maybe(UInt) switch,
the variable is bound to an integer.

All cases have empty tails, i.e. the tail of the switch statement is not
propagated.

A switch statement may only include a consensus transfer in its cases if
it is within a consensus step, because its statements are in the same
context as the conditional statement itself.

It is invalid for a case to appear multiple times, or be missing, or to
be superfluous (i.e. for a variant that does not exist in the Data type
of VAR).

`,

'array' : `const x = array(UInt, \[1, 2, 3\]);

Converts a tuple of homogeneous values of the specific type into an
*array*.

`,

'Tuple.length' : `Tuple.length(tup); tup.length; Array.length(arr); arr.length;

Tuple.length Returns the length of the given tuple.

Array.length Returns the length of the given array.

Both may be abbreviated as expr.length where expr evaluates to a tuple
or an array.

`,

'Array.length' : `Tuple.length(tup); tup.length; Array.length(arr); arr.length;

Tuple.length Returns the length of the given tuple.

Array.length Returns the length of the given array.

Both may be abbreviated as expr.length where expr evaluates to a tuple
or an array.

`,

'Tuple.set' : `Tuple.set(tup, idx, val); tup.set(idx, val); Array.set(arr, idx,
val); arr.set(idx, val);

Tuple.set Returns a new tuple identical to tup, except that index idx is
replaced with val. The idx must be a compile-time constant, because
tuples do not support dynamic access, because each element may be a
different type.

Array.set Returns a new array identical to arr, except that index idx is
replaced with val.

Both may be abbreviated as expr.set(idx, val) where expr evaluates to a
tuple or an array.

`,

'Array.set' : `Tuple.set(tup, idx, val); tup.set(idx, val); Array.set(arr, idx,
val); arr.set(idx, val);

Tuple.set Returns a new tuple identical to tup, except that index idx is
replaced with val. The idx must be a compile-time constant, because
tuples do not support dynamic access, because each element may be a
different type.

Array.set Returns a new array identical to arr, except that index idx is
replaced with val.

Both may be abbreviated as expr.set(idx, val) where expr evaluates to a
tuple or an array.

`,

'Foldable.forEach' : `c.forEach(f) Foldable.forEach(c, f) Array.forEach(c, f)
Map.forEach(c, f)

Foldable.forEach(c, f) iterates the function f over the elements of a
container c, discarding the result. This may be abbreviated as
c.forEach(f).

`,

'Foldable.all' : `Foldable.all(c, f) Array.all(c, f) Map.all(c, f) c.all(f)

Foldable.all(c, f) determines whether the predicate, \`f\`, is satisfied
by every element of the container, \`c\`.

`,

'Foldable.any' : `Foldable.any(c, f) Array.any(c, f) Map.any(c, f) c.any(f)

Foldable.any(c, f) determines whether the predicate, \`f\`, is satisfied
by at least one element of the container, \`c\`.

`,

'Foldable.or' : `Foldable.or(c) Array.or(c) Map.or(c) c.or()

Foldable.or(c) returns the disjunction of a container of Bools.

`,

'Foldable.and' : `Foldable.and(c) Array.and(c) Map.and(c) c.and()

Foldable.and(c) returns the conjunction of a container of Bools.

`,

'Foldable.includes' : `Foldable.includes(c, x) Array.includes(c, x) Map.includes(c, x)
c.includes(x)

Foldable.includes(c, x) determines whether the container includes the
element, \`x\`.

`,

'Foldable.count' : `Foldable.count(c, f) Array.count(c, f) Map.count(c, f) c.count(f)

Foldable.count(c, f) returns the number of elements in \`c\` that satisfy
the predicate, \`f\`.

`,

'Foldable.size' : `Foldable.size(c) Array.size(c) Map.size(c) c.size()

Foldable.size(c) returns the number of elements in \`c\`.

`,

'Foldable.min' : `Foldable.min(c) Array.min(c) Map.min(c) c.min()

Foldable.min(arr) returns the lowest number in a container of \`UInt\`s.

`,

'Foldable.max' : `Foldable.max(c) Array.max(c) Map.max(c) c.max()

Foldable.max(c) returns the largest number in a container of \`UInt\`s.

`,

'Foldable.sum' : `Foldable.sum(c) Array.sum(c) Map.sum(c) c.sum()

Foldable.sum(c) returns the sum of a container of \`UInt\`s.

`,

'Foldable.product' : `Foldable.product(c) Array.product(c) Map.product(c) c.product()

Foldable.product(c) returns the product of a container of \`UInt\`s.

`,

'Foldable.average' : `Foldable.average(c) Array.average(c) Map.average(c) c.average()

Foldable.average(c) returns the mean of a container of \`UInt\`s.

`,

'Array.iota' : `Array.iota(5)

Array.iota(len) returns an array of length len, where each element is
the same as its index. For example, Array.iota(4) returns \[0, 1, 2,
3\]. The given len must evaluate to an integer at compile-time.

`,

'Array.replicate' : `Array.replicate(5, "five") Array\_replicate(5, "five")

Array.replicate(len, val) returns an array of length len, where each
element is val. For example, Array.replicate(4, "four") returns
\["four", "four", "four", "four"\]. The given len must evaluate to an
integer at compile-time.

`,

'Array.concat' : `Array.concat(x, y) x.concat(y)

Array.concat(x, y) concatenates the two arrays x and y. This may be
abbreviated as x.concat(y).

`,

'Array.empty' : `Array\_empty Array.empty

Array.empty is an array with no elements. It is the identity element of
Array.concat. It may also be written Array\_empty.

`,

'Array.zip' : `Array.zip(x, y) x.zip(y)

Array.zip(x, y) returns a new array the same size as x and y (which
must be the same size) whose elements are tuples of the elements of x
and y. This may be abbreviated as x.zip(y).

`,

'Array.map' : `Array.map(arr, f) arr.map(f)

Array.map(arr, f) returns a new array, arr\_mapped, the same size as
arr, where arr\_mapped\[i\] = f(arr\[i\]) for all i. For example,
Array.iota(4).map(x =\> x+1) returns \[1, 2, 3, 4\]. This may be
abbreviated as arr.map(f).

This function is generalized to an arbitrary number of arrays of the
same size, which are provided before the f argument. For example,
Array.iota(4).map(Array.iota(4), add) returns \[0, 2, 4, 6\].

`,

'Array.reduce' : `Array.reduce(arr, z, f) arr.reduce(z, f)

Array.reduce(arr, z, f) returns the [left
fold](https://en.wikipedia.org/wiki/Fold_&higher-order_function)) of the
function f over the given array with the initial value z. For example,
Array.iota(4).reduce(0, add) returns ((0 + 1) + 2) + 3 = 6. This may
be abbreviated as arr.reduce(z, f).

This function is generalized to an arbitrary number of arrays of the
same size, which are provided before the z argument. For example,
Array.iota(4).reduce(Array.iota(4), 0, (x, y, z) =\> (z + x + y))
returns ((((0 + 0 + 0) + 1 + 1) + 2 + 2) + 3 + 3).

`,

'Array.indexOf' : `Array.indexOf(arr, x) arr.indexOf(x)

Array.indexOf(arr, x) returns the index of the first element in the
given array that is equal to \`x\`. The return value is of type
Maybe(UInt). If the value is not present in the array, None is
returned.

`,

'Array.findIndex' : `Array.findIndex(arr, f) arr.findIndex(f)

Array.findIndex(arr, f) returns the index of the first element in the
given array that satisfies the predicate \`f\`. The return value is of
type Maybe(UInt). If no value in the array satisfies the predicate,
None is returned.

`,

'Map.reduce' : `Map.reduce(map, z, f) map.reduce(z, f)

Map.reduce(map, z, f) returns the [left
fold](https://en.wikipedia.org/wiki/Fold_&higher-order_function)) of the
function f over the given mapping with the initial value z. For example,
m.reduce(0, add) sums the elements of the mapping. This may be
abbreviated as map.reduce(z, f).

The function f must satisfy the property, for all z, a, b, f(f(z, b),
a) == f(f(z, a), b), because the order of evaluation is unpredictable.

`,

'Object.set' : `Object.set(obj, fld, val); Object\_set(obj, fld, val); { ...obj,
\[fld\]: val };

Returns a new object identical to obj, except that field fld is replaced
with val.

`,

'Object.setIfUnset' : `Object.setIfUnset(obj, fld, val); Object\_setIfUnset(obj, fld, val);

Returns a new object identical to obj, except that field fld is val if
fld is not already present in obj.

`,

'Object.has' : `Object.has(obj, fld);

Returns a boolean indicating whether the object has the field fld. This
is statically known.

`,

'Maybe' : `const MayInt = Maybe(UInt); const bidA = MayInt.Some(42); const bidB =
MayInt.None(null);  const getBid = (m) =\> fromMaybe(m, (() =\> 0),
((x) =\> x)); const bidSum = getBid(bidA) + getBid(bidB);
assert(bidSum == 42);

[Option types](https://en.wikipedia.org/wiki/Option_type) are
represented in Reach through the built-in Data type, Maybe, which has
two variants: Some and None.

Maybe is defined by export const Maybe = (A) =\> Data({None: Null,
Some: A});

This means it is a function that returns a Data type specialized to a
particular type in the Some variant.

Maybe instances can be conveniently consumed by fromMaybe(mValue,
onNone, onSome), where onNone is a function of no arguments which is
called when mValue is None, onSome is a function of on argument which is
called with the value when mValue is Some, and mValue is a data instance
of Maybe.

const m = Maybe(UInt).Some(5); isNone(m); // false isSome(m); //
true

isNone is a convenience method that determines whether the variant is
\`isNone\`.

isSome is a convenience method that determines whether the variant is
\`isSome\`.

fromSome(Maybe(UInt).Some(1), 0); // 1
fromSome(Maybe(UInt).None(), 0);  // 0

fromSome receives a Maybe value and a default value as arguments and
will return the value inside of the Some variant or the default value
otherwise.

const add1 = (x) =\> x + 1; maybe(Maybe(UInt).Some(1), 0, add1); // 2
maybe(Maybe(UInt).None(), 0, add1);  // 0

maybe(m, defaultVal, f) receives a Maybe value, a default value, and a
unary function as arguments. The function will either return the
application of the function, f, to the Some value or return the default
value provided.

`,

'Either' : `Either is defined by export const Either = (A, B) =\> Data({Left: A,
Right: B});

Either can be used to represent values with two possible types.

Similar to \`Maybe\`, \`Either\` may be used to represent values that are
correct or erroneous. A successful result is stored, by convention, in
\`Right\`. Unlike \`None\`, \`Left\` may carry additional information about
the error.

either(e, onLeft, onRight)

either(e, onLeft, onRight) For an \`Either\` value, \`e\`, \`either\` will
either apply the function \`onLeft\` or \`onRight\` to the appropriate
variant value.

const e = Either(UInt, Bool); const l = e.Left(1); const r =
e.Right(true); isLeft(l);  // true isRight(l); // false const x =
fromLeft(l, 0);      // x = 1 const y = fromRight(l, false); // y =
false

isLeft is a convenience method that determines whether the variant is
\`Left\`.

isRight is a convenience method that determines whether the variant is
\`Right\`.

fromLeft(e, default) is a convenience method that returns the value in
\`Left\`, or \`default\` if the variant is \`Right\`.

fromRight(e, default) is a convenience method that returns the value in
\`Right\`, or \`default\` if the variant is \`Left\`.

`,

'match' : `const Value = Data({    EBool: Bool,    EInt: UInt,    ENull: Null,
});  const v1 = Value.EBool(true);  const v2 = Value.EInt(200);  const
isTruthy = (v) =\>    v.match({      EBool: (b) =\> { return b },
EInt : (i) =\> { return i \!= 0 },      ENull: ()  =\> { return false }
});   assert(isTruthy(v1));  assert(isTruthy(v2));

A *match expression*, written VAR.match({ CASE ... }), where \`VAR\` is a
variable bound to a data instance and \`CASE\` is \`VARIANT: FUNCTION\`,
where \`VARIANT\` is a variant or default, and \`FUNCTION\` is a function
that takes the same arguments as the variant constructor. If the variant
has a type of Null, then the function is allowed to take no arguments.
default functions must always take an argument, even if all defaulted
variants have type Null.

match is similar to a switch statement, but since it is an expression,
it can be conveniently used in places like the right hand side of an
assignment statement.

Similar to a switch statement, the cases are expected to be exhaustive
and nonredundant, all cases have empty tails, and it may only include a
consensus transfer in its cases if it is within a consensus step.

`,

'makeEnum' : `const \[ isHand, ROCK, PAPER, SCISSORS \] = makeEnum(3);

An *enumeration* (or *enum*, for short), can be created by calling the
makeEnum function, as in makeEnum(N), where N is the number of distinct
values in the enum. This produces a tuple of N+1 values, where the first
value is a Fun(\[UInt\], Bool) which tells you if its argument is one
of the enum’s values, and the next N values are distinct UInts.

`,

'assert' : `assert( claim, \[msg\] )

A static assertion which is only valid if claim always evaluates to
true.

> The Reach compiler will produce a counter-example (i.e. an assignment of
> the identifiers in the program to falsify the claim) when an invalid
> claim is provided. It is possible to write a claim that actually always
> evaluates to true, but for which our current approach cannot prove
> always evaluates to true; if this is the case, Reach will fail to
> compile the program, reporting that its analysis is incomplete. Reach
> will never produce an erroneous counter-example.

It accepts an optional bytes argument, which is included in any reported
violation.

> See the guide section on verification to better understand how and what
> to verify in your program.

`,

'forall' : `forall( Type ) forall( Type, (var) =\> BLOCK )

The single argument version returns an abstract value of the given type.
It may only be referenced inside of assertions; any other reference is
invalid.

The two argument version is an abbreviation of calling the second
argument with the result of forall(Type). This is convenient for
writing general claims about expressions, such as

forall(UInt, (x) =\> assert(x == x));

`,

'possible' : `possible( claim, \[msg\] )

A possibility assertion which is only valid if it is possible for claim
to evaluate to true with honest frontends and participants. It accepts
an optional bytes argument, which is included in any reported violation.

`,

'digest' : `digest( arg\_0, ..., arg\_n )

The digest primitive performs a [cryptographic
hash](https://en.wikipedia.org/wiki/Cryptographic_hash_function) of the
binary encoding of the given arguments. This returns a Digest value. The
exact algorithm used depends on the connector.

`,

'balance' : `balance(); balance(gil);

The *balance* primitive returns the balance of the contract account for
the DApp. It takes an optional non-network token value, in which case it
returns the balance of the given token.

`,

'lastConsensusTime' : `lastConsensusTime()

The *lastConsensusTime* primitive returns the time of the last
publication of the DApp. This may not be available if there was no such
previous publication, such as at the beginning of an application where
deployMode is firstMsg.

> Why is there no \`thisConsensusTime\`? Some networks do not support
> observing the time of a consensus operation until after it has
> finalized. This aides scalability, because it increases the number of
> times when an operation could be finalized.

`,

'makeDeadline' : `const \[ timeRemaining, keepGoing \] = makeDeadline(10);

makeDeadline(deadline) takes an UInt as an argument and returns a pair
of functions that can be used for dealing with absolute deadlines. It
internally determines the end time based off of the deadline and the
last consensus time—at the time of calling makeDeadline. \`timeRemaining\`
will calculate the difference between the end time and the current last
consensus time. \`keepGoing\` determines whether the current last
consensus time is less than the end time. It is typical to use the two
fields for the \`while\` and \`timeout\` field of a parallelReduce
expression. For example:

const \[ timeRemaining, keepGoing \] = makeDeadline(10); const \_ =
parallelReduce(...)   .invariant(...)   .while( keepGoing() )
.case(...)   .timeout( timeRemaining(), () =\> { ... })

This pattern is so common that it can be abbreviated as .timeRemaining.

`,

'implies' : `implies( x, y )

Returns true if x is false or y is true.

`,

'ensure' : `ensure( pred, x )

Makes a static assertion that pred(x) is true and returns x.

`,

'hasRandom' : `hasRandom

A participant interact interface which specifies \`random\` as a function
that takes no arguments and returns an unsigned integer of bit width
bits.

`,

'compose' : `compose(f, g)

Creates a new function that applies it’s argument to \`g\`, then pipes the
result to the function \`f\`. The argument type of \`f\` must be the return
type of \`g\`.

`,

'sqrt' : `sqrt(81, 10)

Calculates an approximate square root of the first argument. This method
utilizes the [Babylonian
Method](https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method)
for computing the square root. The second argument must be an UInt whose
value is known at compile time, which represents the number of
iterations the algorithm should perform.

For reference, when performing 5 iterations, the algorithm can reliably
calculate the square root up to \`32\` squared, or \`1,024\`. When
performing 10 iterations, the algorithm can reliably calculate the
square root up to \`580\` squared, or \`336,400\`.

`,

'pow' : `pow (2, 40, 10) // =\> 1,099,511,627,776

pow(base, power, precision) Calculates the approximate value of raising
base to power. The third argument must be an UInt whose value is known
at compile time, which represents the number of iterations the algorithm
should perform. For reference, \`6\` iterations provides enough accuracy
to calculate up to \`2^64 - 1\`, so the largest power it can compute is
\`63\`.

`,

};
export const module = {
'export' : `Module-level identifier definitions may be \_export\_ed by writing  export
in front of them. For example, export const x = 1; export const \[a, b,
...more\] = \[ 0, 1, 2, 3, 4 \]; export function add1(x) { return x +
1; };  are valid exports.

Module-level identifiers may also be exported after the fact, and may be
renamed during export. For example:

const w = 2; const z = 0; export {w, z as zero};

Identifiers from other modules may be re-exported (and renamed), even if
they are not imported in the current module. For example:

export {u, x as other\_x} from ./other-module.rsh;

An exported identifier in a given module may be imported by other
modules.

Exports are also exposed to the frontend via getExports. Functions are
only exposed if they are typed, that is, if they are constructed with
is.

`,

'import' : `import games-of-chance.rsh;

When a module, \`X\`, contains an *import*, written import "LIB.rsh";,
then the path \`"LIB.rsh"\` must resolve to another Reach source file. The
exports from the module defined by \`"LIB.rsh"\` are included in the set
of bound identifiers in \`X\`.

import {flipCoin, rollDice as d6} from games-of-chance.rsh;

Import statements may limit or rename the imported identifiers.

import \* as gamesOfChance from games-of-chance.rsh;

Imports may instead bind the entire module to a single identifier, which
is an object with fields corresponding to that module’s exports.

Import cycles are invalid.

The path given to an import may **not** include \`..\` to specify files
outside the current directory **nor** may it be an absolute path.

It **must** be a relative path, which is resolved relative to the parent
directory of the source file in which they appear.

`,

'Reach.App' : `export const main = Reach.App(() =\> {  const A = Participant("A", {
displayResult: Fun(Int, Null),  });  deploy();   const result = 0;
A.only(() =\> { interact.displayResult(result); });   exit(); });

*Reach.App* accepts a no-argument function that specifies a DApp. This
function is applied during compilation in as an application
initialization. It specifies the entire DApp in its body.

If the result of Reach.App is eventually bound to an identifier that is
exported, then that identifier may be a target given to the compiler, as
discussed in the section on usage.

`,

};
export const appinit = {
'deploy' : `deploy();

A *deploy statement*, written deploy();, deploys the DApp and
finalizes all of the available participants, views, and compilation
options.

Its continuation is a step, which means its content is specified by
Steps. It represents the body of the DApp to be compiled.

`,

'setOptions' : `setOptions({ verifyArithmetic: true }); setOptions({});

The *compilation options* for the DApp may be set by calling
setOptions(OBJ\_EXPR); where OBJ\_EXPR is an object with the following
keys and values:

\`\`\` racket
deployMode         constructor (default) or firstMsg Determines whether contract should be deployed independently            
                                                     (constructor) or as part of the first publication (firstMsg). If        
                                                     deployed as part of the first publication, then the first publication   
                                                     must precede all uses of wait and .timeout. See the guide on deployment 
                                                     modes for a discussion of why to choose a particular mode.              
                                                                                                                             
verifyArithmetic   true or false (default)           Determines whether arithmetic operations automatically introduce static 
                                                     assertions that they do not overflow beyond UInt.max. This defaults to  
                                                     false, because it is onerous to verify. We recommend turning it on      
                                                     before final deployment, but leaving it off during development. When it 
                                                     is false, connectors will ensure that overflows do not actually occur on
                                                     the network.                                                            
                                                                                                                             
verifyPerConnector true or false (default)           Determines whether verification is done per connector, or once for a    
                                                     generic connector. When this is true, then connector-specific constants,
                                                     like UInt.max, will be instantiated to literal numbers. This            
                                                     concretization of these constants can induce performance degradation in 
                                                     the verifier.                                                           
                                                                                                                             
connectors         [ETH, ALGO] (default)             A tuple of the connectors that the application should be compiled for.  
                                                     By default, all available connectors are chosen.                        
\`\`\`

`,

};
export const local = {
'this' : `Inside of a local step, this refers to the participant performing the
step. This is useful when the local step was initiated by an each
expression.

`,

'interact' : `interact.amount interact.notify(handA, handB)
interact.chooseAmount(heap1, heap2)

An *interaction expression*, written interact.METHOD(EXPR\_0, ...,
EXPR\_n), where METHOD is an identifier bound in the participant
interact interface to a function type, and EXPR\_0 through EXPR\_n are
expressions that evaluates to the result of an interaction with a
frontend that receives the evaluation of the n expressions and sends a
value.

An interaction expression may also be written interact.KEY, where KEY is
bound in the participant interact interface to a non-function type.

An interaction expression may only occur in a local step.

`,

'assume' : `assume( claim, \[msg\] )

An assumption where claim evaluates to true with honest frontends. This
may only appear in a local step. It accepts an optional bytes argument,
which is included in any reported violation.

`,

'fail' : `fail()

is a convenience method equivalent to assume(false). This may only
appear in a local step.

`,

'declassify' : `declassify( arg )

The *declassify* primitive performs a declassification of the given
argument.

`,

'makeCommitment' : `makeCommitment( interact, x )

Returns two values, \[ commitment, salt \], where salt is the result of
calling interact.random(), and commitment is the digest of salt and x.
This is used in a local step before checkCommitment is used in a
consensus step.

`,

};
export default {
...consensus,
...step,
...compute,
...module,
...appinit,
...local,
};
