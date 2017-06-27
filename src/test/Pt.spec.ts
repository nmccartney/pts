import chai = require('chai');
import mocha = require('mocha');
import {Pt, Group} from '../Pt';
import {Geom} from '../Op';

var {assert} = chai;
var {describe, it} = mocha;


describe('Pt: ', () => {

  describe('Pt Constructor: ', () => {
    it('can init multi-dimensions', () => {
      assert.equal( 6, new Pt(1,2,3,4,5,6).length )
    });

    it('can init in 1 dimensions', () => {
      assert.equal( 1, new Pt(10).length )
    });

    it('should init with positional arguments', () => {
      let p1 = new Pt(10,100,1000,10000);
      let p2 = new Pt(11,111,1111);
      let p3 = new Pt(22,222);
      let p4 = new Pt(3);
      assert.equal(11346, p1[0] + p1[3] + p2[2] + p3[1] + p4[0]);
    });

    it('should init with IPt-like object', () => {
      let p1 = new Pt({x:10,y:100,z:1000,w:10000});
      let p2 = new Pt({x:11,y:111,z:1111});
      let p3 = new Pt({x:22,y:222});
      let p4 = new Pt({x:3});
      assert.equal(11346, p1[0] + p1[3] + p2[2] + p3[1] + p4[0]);
    });

    it('should init with Pt object', () => {
      let p = new Pt( new Pt(1,2,3,4,5,6) );
      assert.equal( 15, p[0]+p[1]+p[2]+p[3]+p[4] );
    });

  
    it('should init with Array of numbers', () => {
      let p1 = new Pt([10,100,1000,10000]);
      let p2 = new Pt([11,111,1111]);
      let p3 = new Pt([22,222]);
      let p4 = new Pt([3]);
      assert.equal(11346, p1[0] + p1[3] + p2[2] + p3[1] + p4[0]);
    });

    it('can init by filling dimensions', () => {
      let p = Pt.make(5, 100);
      assert.isTrue( p.length === 5 && p[3] === 100);
    });
    

  });

  describe('Pt Functions: ', () => {

    it('can check size of vector', () => {
      let p = new Pt([1,2,3,4,5,6]);
      assert.equal( 6, p.length );
    });

    it('can update values', () => {
      let p = new Pt([1,2,3,4,5,6]);
      p.to(0,10,100);
      assert.isTrue( p.equals( new Pt(0,10,100,4,5,6)) );
    });

    it('can check equality', () => {
      let p = new Pt( 1, 2.1, 3.01 );
      let p2 = new Pt( 1.01, 2, 3 );
      assert.isTrue( p.equals( new Pt(1,2,3), 0.101) && (p2.equals( new Pt(1,2,3), 0.0099) === false) );
    });

    it('can apply operations with op', () => {
      let f1 = (a:Pt):Pt => a.$add(1);
      let f2 = (b:Pt, n:number):Pt => p.$multiply(n);
      
      let p = new Pt(3,4,5);
      let pf1 = p.op( f1 );
      let pf2 = pf1().op( f2 );
      let r1 = pf2(2);
      let r2 = r1.op( (p:Pt) => p.$multiply(3) ); 

      assert.isTrue( r2().equals( new Pt(18, 24, 30) ) );
    });

    it('can apply multiple ops', () => {
      let p = new Pt(1,2,3);
      let ops = p.ops([ (a:Pt):Pt => a.$add(1,2,3), (b:Pt, n:number):Pt => p.$multiply(n) ]);
      let q = ops[0]().$add( ops[1](3) );
      assert.equal( q.z, 15 )
    });

    it('can map to a function', () => {
      let p = new Pt(5,7,12).$map( (n:number, i:number, list) => {
        return n*10+2;
      });
      assert.isTrue( p.equals( new Pt(52, 72, 122) ) )
    });

    it('can take specific dimensions', () => {
      let p = new Pt(1,2,3,4,5,6).$take([1,3,5]);
      assert.isTrue( p.equals( new Pt(2, 4, 6) ) );
    });
    
    it('can add with different args', () => {
      let p = new Pt({x:1,y:2,z:3}).add([1,1,1]).add(2,2,2).add(new Pt(3,4,5));
      assert.isTrue( p.$add(1,2,3).$add([2, 4, 0]).equals( new Pt(10, 15, 14) ) );
    });

    it('can subtract with different args', () => {
      let p = new Pt({x:19,y:18,z:7}).subtract([5,4,3]).subtract(2,2,2).subtract(new Pt(1,1,1));
      assert.isTrue( p.$subtract(1,-1,1).$subtract([5, 7, 0]).equals( new Pt(5, 5, 0) ) );
    });

    it('can support for-of loop', () => {
      let p = new Pt([1,2,3,4,5,6]);
      let d = 0;
      for (let k of p) {
        d += k
      }
      assert.equal( d, 21 );
    });

    it('can concat with another Pt or array', () => {
      let p = new Pt(1,2,3).$concat([2,3]).$concat(new Pt(10, 20, 30, 40));
      assert.equal( p.length, 9 );
    })

    it('can get a slice of values', () => {
      let p = new Pt(1,2,3,4,5,6);
      assert.isTrue( p.$slice(2,5).equals( new Pt(3,4,5) ) );
    })

    it('can get a normalized unit vector', () => {
      let p = new Pt(123,3453,293);
      assert.isTrue( Math.abs(p.unit().magnitude()-1) < 0.00001 );
    })

    it('can calculate dot product', () => {
      let p = new Pt(1,2,3,4).dot( 10,9,8,7 );
      assert.equal( p, 80 );
    })

    it('can calculate projection', () => {
      let p = new Pt(1, 2).$project(new Pt(-4, 1)).equals( new Pt(-2/5, -4/5), 0.001 );
      assert.isTrue( p );
    })

    it('can calculate cross product', () => {
      let p = new Pt(3, -3, 1).$cross( new Pt(4, 9, 2) );
      assert.isTrue( p.equals( new Pt(-15, -2, 39) ));
    })

    it('can calculate abs', () => {
      let p = new Pt(3, -3, 1).$abs();
      assert.isTrue( p.equals( new Pt(3,3,1) ));
    })

    it('can calculate angle', () => {
      let p = new Pt(0.5, 0.9, 0.8).angle('yz');
      assert.isTrue( Math.abs(p-0.7266) < 0.0001);
    })

    it('can calculate angle between two Pt', () => {
      let p = new Pt(0.5, 0.9, 0.8).angleBetween( new Pt(0.7, 0.5) );
      assert.isTrue( Math.abs(p-0.4434) < 0.0001);
    })

    it('can move to a new direction', () => {
      let p = new Pt(10,0).toAngle( Math.PI/2  );
      assert.isTrue( Math.abs(p.x-0) < 0.00001 && Math.abs(p.y-10) < 0.00001);
    })

    it('can find minimum point', () => {
      let p = new Pt(3, -3, 1, -10).$min( new Pt(4, 9, -2, 0) );
      assert.isTrue( p.equals( new Pt(3, -3, -2, -10) ));
    })

    it('can find maximum point', () => {
      let p = new Pt(3, -3, 1, -10).$max( new Pt(4, 9, -2, 0) );
      assert.isTrue( p.equals( new Pt(4, 9, 1, 0) ));
    })
    
  });


  describe('Group collection functions', () => {

    it('can deep clone', function() {
      let p = new Group( new Pt(1,2), new Pt(2,3) );
      let q = p.clone().map( (a) => a.add(10) );
      assert.isTrue( p[1].x == 2 && q[1].x == 12 );
    });

    it('can create from number array', function() {
      let p = Group.fromArray( [[1,2],[3,4],[5,6]] ).moveBy( 10, 20 );
      assert.equal( p[2].y, 26 );
    });

    it('can create from GroupLike array', function() {
      let p = Group.fromGroup( [ new Pt(1,2), new Pt(3,4), new Pt(5,6) ] ).moveBy( 10, 20 );
      assert.equal( p[2].x, 15);
    });

    it('can split into an array of subgroups', function() {
      let p = Group.fromArray( [[1,2],[3,4],[5,6],[7,8],[9,10]] );
      let sp = p.split(2);
      assert.isTrue( sp.length == 2 && sp[1][1].y == 8 )
    });

    it('can split into an array of subgroups with stride', function() {
      let p = Group.fromArray( [[1,2],[3,4],[5,6],[7,8],[9,10]] );
      let sp = p.split(4,1);
      assert.isTrue( sp.length == 2 && sp[1][3].y == 10 )
    });

    it('can insert another group into a specific position', function() {
      let a = Group.fromArray( [[1,2],[3,4],[5,6]] );
      let b = Group.fromArray( [[7,8],[9,10]] );
      a.insert( new Group(new Pt(7,8), new Pt(9,10)), 1 );
      assert.isTrue( a.length == 5 && a[1].y == 8);
    });

    it('can remove a range', function() {
      let p = Group.fromArray( [[1,2],[3,4],[5,6],[7,8],[9,10]] );
      p.remove( 1,3 );
      assert.isTrue( p.length == 2 && p[1].x == 9 );
    });

    it('can remove a range using negative index', function() {
      let p = Group.fromArray( [[1,2],[3,4],[5,6],[7,8],[9,10]] );
      p.remove( -3, p.length );
      assert.isTrue( p.length == 2 && p[1].x == 3 );
    });

    it('can convert into an op', function() {
      let p = Group.fromArray( [[1,2],[3,4],[5,6]] );
      let s = p.op( Geom.scale );
      s(3);
      assert.equal( p[1].y, 12 );
    });

    it('can convert into multiple ops', function() {
      let p = Group.fromArray( [[1,2],[3,4],[5,6], [7,8]] );
      let s = p.ops( [Geom.scale, Geom.centroid] );
      s[0](2);
      assert.equal( s[1]().x, 8 );
    });
    

    it('can zip one slice', function() {
      let p = new Group( new Pt(1,3,5,7), new Pt(2,4,6,8), new Pt(5,10,15,20) ).zipOne( 2 );
      assert.isTrue( p.equals( new Pt(5,6,15) ) )
    });

    it('can zip one slice with default', function() {
      let p = new Group(new Pt(1), new Pt(2,4,6), new Pt(5,10)).zipOne( 2, -1 );
      assert.isTrue( p.equals( new Pt(-1, 6, -1) ) )
    });

    it('can zip an array of Pt', function() {
      let ps = new Group( new Pt(1,2), new Pt(3,4), new Pt(5,6) ).zip();
      assert.isTrue( ps[1].equals( new Pt(2,4,6) ) && ps.length == 2 );
    });

    it('can zip an array of Pt with defaults', function() {
      let ps = new Group( new Pt(1,2), new Pt(3), new Pt(5,6,7,8)).zip( 10 );
      assert.isTrue( ps[1].equals( new Pt(2, 10, 6) ) && ps.length == 2 );
    });

    it('can zip an array of Pt with longest value', function() {
      let ps = new Group( new Pt(1,2), new Pt(3), new Pt(5,6,7,8) ).zip( 10, true );
      assert.isTrue( ps[2].equals( new Pt(10, 10, 7) ) && ps.length == 4 );
    });
  });

    describe('Group geometry functions', () => {

      it('can interpolate a position based on all Pts in this group', function() {
        let ps = new Group( new Pt(0,0), new Pt(10, 10), new Pt(20, 100) );
        assert.equal( ps.interpolate( 0.75 ).y, 55 );
      });

      it('can move by a specific amount', function() {
        let ps = new Group( new Pt(0,0), new Pt(10, 10), new Pt(20, 100) );
        ps.moveBy( 5, 1 );
        assert.isTrue( ps[0].x === 5 && ps[1].y === 11 && ps[2].x === 25 );
      });

      it('can move the group based on a specific position for the first Pt', function() {
        let ps = new Group( new Pt(5,0), new Pt(10, 10), new Pt(20, 100) );
        ps.moveTo( 50, 50 );
        assert.isTrue( ps[0].x === 50 && ps[1].x === 55 && ps[2].y === 150 );
      });

      it('can scale a group', function() {
        let ps = new Group( new Pt(0,0,1), new Pt(3,6,5) );
        ps.scale( [10,9,8], [0,0,0] );
        assert.isTrue( ps[0].x === 0 && ps[1].y === 54 && ps[0].z === 8 );
      });


    });
});
