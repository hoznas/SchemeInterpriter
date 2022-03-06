import scala.util.matching.Regex


abstract class ScmObj
class ScmValue 
trait ScmToken
case class ScmInt(v:Int) extends ScmValue with ScmToken{
  override def toString():String = v.toString()
}
case class ScmSym(v:String) extends ScmValue with ScmToken{
  override def toString():String = v.toString()
}
case class ScmStr(v:String) extends ScmValue with ScmToken{
  override def toString():String = "\"" + v.toString() + "\""
}
case class ScmCons(car:ScmValue, cdr:ScmValue) extends ScmValue{
  val list:Boolean = cdr match {
    case x @ ScmCons(_,_) => x.list
    case ScmNil()       => true
    case _              => false
  }
  override def toString():String = {
    if(list){
      def helper(v:ScmValue):String = {
        v match {
          case ScmCons(a,b) => a.toString() + " " + helper(b)
          case ScmNil()     => ")"
          case _            => throw new Exception("ScmCons::toString() ERROR")
        }
      }
      "(" + helper(this)
    }else{
      "(%s . %s)".format(car,cdr)
    }
  }
}
case class ScmNil() extends ScmValue{
  override def toString():String = "nil"
}
case class ScmLPar() extends ScmObj with ScmToken{
  override def toString():String = "("
}
case class ScmRPar() extends ScmObj with ScmToken{
  override def toString():String = ")"
}

object SchemeInterpriter{
  def drop_ws(src: String): String ={
    val re_ws:Regex = """^(\s+)(.*)""".r
    src match {
      case re_ws(_,x) => x
      case _          => src
    }
  }
  def tokenize(src: String): List[ScmToken] ={
    val src2 = drop_ws(src)
    if(src2 == "") return Nil
    val re_lpar:Regex = """^(\()(.*)""".r
    val re_rpar:Regex = """^(\))(.*)""".r
    val re_op:Regex = """^(\+|\-|<=|>=|!=|<|>)(.*)""".r
    val re_num:Regex = """^(\d+)(.*)""".r
    val re_sym:Regex = """^([a-zA-Z_][a-zA-Z0-9_]*)(.*)""".r
    val re_str:Regex = """^"(.*?)"(.*)""".r

    val (token,rest) = src2 match {
      case re_lpar(x,y) => (new ScmLPar,y)
      case re_rpar(x,y) => (new ScmRPar,y)
      case re_op(x,y)   => (new ScmSym(x),y)
      case re_num(x,y)  => (new ScmInt(x.toInt),y)
      case re_str(x,y)  => (new ScmStr(x),y)
      case re_sym(x,y)  => (new ScmSym(x),y)
      case _            => throw new Exception("tokenize() ERROR at ["+src2+"]")
    }
    return token :: tokenize(rest)
  }

  def cons(a:ScmValue, b:ScmValue): ScmCons = new ScmCons(a,b)
  def reverse_cons(lst:List[ScmValue], result:ScmValue=new ScmNil): ScmValue = {
    if(lst == Nil) result
    else reverse_cons(lst.tail, cons(lst.head, result))
  }
  def parse(tokens:List[ScmToken], result:List[ScmValue]): (List[ScmToken],ScmValue) = {
    if(tokens == Nil) return (Nil,reverse_cons(result))
    val head = tokens.head
    val (rest,token) = tokens.head match {
      case ScmLPar() => parse(tokens.tail,Nil)
      case ScmRPar() => return (tokens.tail,reverse_cons(result))
      case a @ ScmInt(v) => (tokens.tail,a)
      case a @ ScmSym(v) => (tokens.tail,a)
      case a @ ScmStr(v) => (tokens.tail,a)
      case _         => throw new Exception("parse() ERROR => ["+tokens.head+"]")
    }
    parse(rest, token::result)
  }

  def main(args: Array[String]) :Unit = {
    val src = if(args.length != 0) args(0)
              else """(define a 123)(+ a 45 "c")"""
    println(src)
    val tokens = tokenize(src)
    println(tokens.mkString("","|",""))
    val (_, tree) = parse(tokens,Nil)
    println(tree)
  }
}