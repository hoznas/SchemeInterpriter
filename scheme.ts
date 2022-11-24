import {Obj,Num,Str,Sym,Cons,List,PairCell,ListCell,Nil,implementsList}  from './basic-types'
import {TokenizerAndParser}  from './tokenizer-parser'

const nil = Nil.getInstance()

/*
    inject(init:ScmObj, f:(result:ScmObj,item:ScmObj)=>ScmObj){
        if(this.tail_ instanceof ListCell){
            this.tail_.inject(f(init,this.head_),f)
        }else{
            return init
        }
    }
    map(f:(x:ScmObj)=>ScmObj):List{
        if(this.tail_ == nil) return nil
        else return new ListCell(f(this.head_), this.tail_) 
    }*/
class Evaluator{ 
    constractor(){}
    evaluate_root(exps: List): Obj{
        let result: Obj = nil
        for(let ptr = exps; ptr != nil; ptr = ptr.tail()){
            result = this.evaluate(ptr.head())
        }
        return result
    }

    evaluate(exp:Obj):Obj{
        if(exp instanceof Num || exp instanceof Str){
            return exp
        }else if(exp instanceof Sym){
            // scope.get
            throw "evaluate(sym)"
        }else if(exp instanceof PairCell){
            return new PairCell(
                this.evaluate(exp.car()),
                this.evaluate(exp.cdr()))
        }else if(exp instanceof ListCell){
            //Call()
            throw "evaluate(call)"
        }else{
            throw "evaluate(else)"
        }
    }
    arg(args:List, n:number):Obj[]{
        if(n<=0) throw "ERROR arg(n)"
        let result:Obj[] = []
        for(let ptr=args; ptr!=nil; ptr=ptr.tail()){
            if(n==0){
                return result
            }else{
                result.push(ptr.head())
            }
        }
        throw "ERROR arg(args)"
    }
}

/*

function call(op:ScmObj, args:ScmObj):ScmObj{
    let evaluated = args.map(e=>evaluate(e))
    //let eop = eval(op)
    if(op instanceof Sym){
        if(op.value == "+"){

        }else if(op.value == "-"){
        
        }else{
            throw "ERROR call(sym)"
        }
    }else{
        throw "ERROR call(other?)"
    }
    
}*/

let code = ""
code = '(if (< a 1) (print "hello world") false)(+ abc 345)222'
console.log("[CODE]>", code)
const token_list = TokenizerAndParser.tokenize(code)
console.log("[TOKENS]>", token_list.toString())
const tree = TokenizerAndParser.parse(token_list)
console.log("[TREE]",tree.toString())



class Test{
    constructor(public code:string, public mustbe:string){}
}
let tests:Test[] = [
    new Test("1","1"),
    new Test("123","123"),
    new Test('"abc"','"abc"'),
//    new Test('(+ 1 2)','3'),
]

for(let t of tests){
    const token_list = TokenizerAndParser.tokenize(t.code)
    const tree = TokenizerAndParser.parse(token_list)
    const e = new Evaluator()
    const result = e.evaluate_root(tree)
    const s = result.toString()
    if(s !== t.mustbe){
        throw `ERROR CODE=${t.code} RESULT=${s}, but MUSTBE=${t.mustbe}`
    }
}

console.log("ALL test(s) is ok.")
