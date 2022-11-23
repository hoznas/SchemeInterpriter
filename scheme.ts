type ScmObj = Num | Str | Sym | Cons | Nil | List
class Num{
    constructor(public value:number){}
    toString(){return String(this.value)}
}
class Str{
    constructor(public value:string){}
    toString(){return `"${this.value}"`}
}
class Sym{
    constructor(public value:string){}
    toString(){return this.value}
}
class Nil implements List{
    private static instance = new Nil
    static getInstance(){return this.instance}
    private constructor(){} 
    head():ScmObj{ return this} 
    tail():List{ return this} 
    toString(){return "Nil"}
}
const nil = Nil.getInstance()
function implementsList(arg:any): arg is List{
    return arg != null && typeof arg === "object" && arg.head === "object" && arg.tail === "object"
}
interface List{
    head(): ScmObj
    tail(): List
    toString():string
}
abstract class Cons{
    static new(car:ScmObj,cdr:ScmObj):Cons{
        if(implementsList(cdr)){
            return new ListCell(car, cdr)
        }else{
            return new PairCell(car,cdr)
        }
    }
    abstract car():ScmObj
    abstract cdr():ScmObj
}
class PairCell extends Cons{
    constructor(private car_: ScmObj, private cdr_: ScmObj){super()}
    car():ScmObj{ return this.car_} 
    cdr():ScmObj{ return this.cdr_} 
    toString():string{
        return `(${this.car_.toString()}.${this.cdr_.toString()})`
    }
}
class ListCell extends Cons implements  List{
    constructor(private head_: ScmObj, private tail_: List){super()}
    car():ScmObj{ return this.head_} 
    cdr():ScmObj{ return this.tail_}
    head():ScmObj{ return this.head_} 
    tail():List{ return this.tail_} 
    toString():string{
        let result: string = "("
        for(let ptr:List=this; ptr!=nil; ptr=ptr.tail()){
            result += ` ${ptr.head().toString()}`
        }
        return result + ")"
    }
}

abstract class TokenizerAndParser{
    static tokenize(code: string): ScmObj[]{
        const re_int = '[0-9]+'
        const re_str = '".*?"'
        const re_sym = '[a-zA-Z_]+'
        const re_op2 = '<=>|>=|<=|!=|==|[|][|]'
        const re_op1 = '-|[+*%<>/()]'
        const re = new RegExp(`(${re_int})|(${re_str})|(${re_sym}|${re_op2}|${re_op1})` ,"g")
        const result: ScmObj[] = [] 
        const replacer = function (_match:string, p_int:string, p_str:string, p_sym:string):string{
            if(p_int){
                result.push(new Num(parseInt(p_int)))
            }else if(p_str){
                // delete '"'
                result.push(new Str(p_str.substring(1,p_str.length-1)))
            }else if(p_sym) {
                result.push(new Sym(p_sym))
            }else{
                throw "ERROR at tokenize()"
                //console.log(match, p_int, p_str, p_sym)
            }
            return ""
        }
        code.replace(re, replacer)
        return result
    }
    static parse(tokens: ScmObj[]): List{
        const result: ScmObj[]=[]
        while(tokens.length != 0){
            const t = tokens.shift()!
            if(t instanceof Sym && t.value == "("){
                result.push(this.parse(tokens))
            }else if(t instanceof Sym && t.value == ")"){
                return this.ary2list(result)
            }else{
                result.push(t)
            }
        }
        return this.ary2list(result)
    }
    static ary2list(ary: ScmObj[]): List{
        if(ary.length != 0){
            const x = ary.shift()!
            return new ListCell(x,this.ary2list(ary))
        }
        return nil
    }
}
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
    evaluate_root(exps: List): ScmObj{
        let result: ScmObj = nil
        for(let ptr = exps; ptr != nil; ptr = ptr.tail()){
            result = this.evaluate(ptr.head())
        }
        return result
    }

    evaluate(exp:ScmObj):ScmObj{
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
    arg(args:List, n:number):ScmObj[]{
        if(n<=0) throw "ERROR arg(n)"
        let result:ScmObj[] = []
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
function arg(args:Cons, n:number, result:ScmObj[]=[]):ScmObj[]{
    if(n<=0){
        return result
    }else if(args===nil){
        throw "arg(nil)"
    }else if(args !== nil){
        if
        result.push(args.car)
        arg(args.cdr, n-1, result)
    }
}
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
